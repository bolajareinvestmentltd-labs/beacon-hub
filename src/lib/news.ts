export function sortLatestNews<T extends { publishedAt: string | Date }>(articles: T[]) {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function latestNews<T extends { publishedAt: string | Date }>(articles: T[], limit = 6) {
  return sortLatestNews(articles).slice(0, limit);
}

