const ALLOWED_TAGS = new Set([
  'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img',
]);

const ALLOWED_ATTRIBUTES = new Set(['href', 'title', 'src', 'alt']);

function escapeAttribute(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Sanitize trusted editorial HTML without importing jsdom in a server action. */
export function sanitizeServerHTML(html: string) {
  if (!html || typeof html !== 'string') return '';

  return html.replace(/<!--([\s\S]*?)-->|<\/?([a-z0-9]+)([^>]*)>|[^<]+/gi, (match, _comment, tagName, rawAttributes) => {
    if (!tagName) return match.startsWith('<!--') ? '' : match;

    const tag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return '';
    if (match.startsWith('</')) return `</${tag}>`;
    if (tag === 'br') return '<br />';

    const attributes = String(rawAttributes || '').replace(
      /([a-z0-9:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gi,
      (attributeMatch, name, doubleValue, singleValue, unquotedValue) => {
        const attribute = name.toLowerCase();
        if (!ALLOWED_ATTRIBUTES.has(attribute)) return '';
        const value = doubleValue ?? singleValue ?? unquotedValue ?? '';
        if ((attribute === 'href' || attribute === 'src') && !/^(https?:|mailto:|\/)/i.test(value)) {
          return '';
        }
        return ` ${attribute}="${escapeAttribute(value)}"`;
      }
    );

    return `<${tag}${attributes}>`;
  });
}