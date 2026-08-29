/**
 * Sanitize plain text input without loading the server-side HTML sanitizer.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .substring(0, 10000);
}