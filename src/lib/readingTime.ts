/**
 * Reading Time Calculator Utility
 * Determines estimated reading time for articles
 */

export interface ReadingTimeResult {
  minutes: number;
  seconds: number;
  totalSeconds: number;
  displayText: string;
}

/**
 * Calculate reading time from content text
 * Based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(contentText: string): ReadingTimeResult {
  // Remove HTML tags if present
  const plainText = contentText.replace(/<[^>]*>/g, '');

  // Count words
  const wordCount = plainText.trim().split(/\s+/).length;

  // Average reading speed
  const wordsPerMinute = 200;

  // Calculate time
  const totalSeconds = Math.ceil((wordCount / wordsPerMinute) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Format display text
  let displayText = '';
  if (minutes === 0) {
    displayText = seconds < 30 ? 'Less than 1 min read' : `${seconds}s read`;
  } else if (minutes === 1) {
    displayText = 'About 1 min read';
  } else {
    displayText = `${minutes} min read`;
  }

  return {
    minutes,
    seconds,
    totalSeconds,
    displayText,
  };
}

/**
 * Get word count from content
 */
export function getWordCount(contentText: string): number {
  const plainText = contentText.replace(/<[^>]*>/g, '');
  return plainText.trim().split(/\s+/).length;
}

/**
 * Get estimated reading time in minutes (integer)
 */
export function getReadingTimeMinutes(contentText: string): number {
  const wordCount = getWordCount(contentText);
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Get a human-readable reading time string
 */
export function getReadingTimeString(contentText: string): string {
  return calculateReadingTime(contentText).displayText;
}
