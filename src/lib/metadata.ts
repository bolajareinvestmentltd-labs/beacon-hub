export function normalizeArticleSlug(value: string | null | undefined): string {
  const raw = String(value ?? '').trim();

  if (!raw) {
    return '';
  }

  let decoded = raw;

  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }

  return decoded
    .toLowerCase()
    .replace(/[%_\s]+/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugToArticleTitle(slug: string | null | undefined): string {
  const normalized = normalizeArticleSlug(slug);

  if (!normalized) {
    return 'Beacon Hub Story';
  }

  return normalized
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getArticleSlugCandidates(slug: string | null | undefined): string[] {
  const raw = String(slug ?? '').trim();

  if (!raw) {
    return [];
  }

  const variants = new Set<string>([
    raw,
    raw.toLowerCase(),
    normalizeArticleSlug(raw),
    raw.replace(/[_\s]+/g, '-'),
    raw.replace(/-/g, ' '),
  ]);

  const decodedVariants = new Set<string>();
  try {
    const decoded = decodeURIComponent(raw);
    decodedVariants.add(decoded);
    decodedVariants.add(decoded.toLowerCase());
    decodedVariants.add(normalizeArticleSlug(decoded));
    decodedVariants.add(decoded.replace(/[_\s]+/g, '-'));
    decodedVariants.add(decoded.replace(/-/g, ' '));
  } catch {
    // ignore invalid encoding and keep the raw slug only
  }

  for (const candidate of decodedVariants) {
    variants.add(candidate);
  }

  return [...variants].filter(Boolean).map((value) => value.trim().toLowerCase());
}
