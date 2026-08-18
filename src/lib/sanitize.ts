import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML safe to display
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img'],
    ALLOWED_ATTR: ['href', 'title', 'src', 'alt'],
  });
}

function escapeHTML(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Preserve paragraph structure when editorial copy is pasted as plain text. */
export function formatEditorialContent(content: string): string {
  if (!content || typeof content !== 'string') return '';

  if (/<(?:p|br|img|strong|em|b|i|h[1-6]|ul|ol|li)\b/i.test(content)) {
    return sanitizeHTML(content);
  }

  return content
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => `<p>${paragraph.split(/\r?\n/).map(escapeHTML).join('<br />')}</p>`)
    .join('');
}

/**
 * Sanitize plain text input (remove HTML tags, trim whitespace)
 * @param input - Text to sanitize
 * @returns Cleaned text
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 10000); // Limit length
}

/**
 * Sanitize email address
 * @param email - Email to sanitize
 * @returns Cleaned email (lowercase, trimmed)
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  return email.trim().toLowerCase();
}

/**
 * Sanitize slug (for URLs)
 * @param slug - Slug to sanitize
 * @returns Valid URL-safe slug
 */
export function sanitizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') return '';
  
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Sanitize array of strings
 * @param arr - Array to sanitize
 * @returns Sanitized array
 */
export function sanitizeArray<T extends string>(arr: T[]): T[] {
  if (!Array.isArray(arr)) return [];
  
  return arr.map(item => sanitizeInput(item) as T).filter(item => item.length > 0);
}

/**
 * Escape string for safe JSON display
 * @param str - String to escape
 * @returns Escaped string
 */
export function escapeJSON(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}
