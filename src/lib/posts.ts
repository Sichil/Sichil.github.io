import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/**
 * 哪些文章算"已发表"：
 *  - 没有 draft: true
 *  - pubDate 不晚于当前时间（防止手滑写成明年）
 * 之后按发布时间从新到旧排序。
 */
export async function getPosts(): Promise<Post[]> {
  const now = Date.now();
  const posts = await getCollection(
    'posts',
    ({ data }) => data.draft !== true && data.pubDate.getTime() <= now,
  );

  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** 中文阅读时长估算：约 350 字/分钟，最少 1 分钟 */
export function readingTime(body: string | undefined): number {
  const text = (body ?? '').replace(/\s+/g, '');
  return Math.max(1, Math.round(text.length / 350));
}

/** 2026年11月15日 */
export function formatDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/** 2026-11-15，用于 <time datetime=""> */
export function formatISO(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** 同一年的文章分组，用于归档页 */
export function groupByYear(posts: Post[]): Array<{ year: number; posts: Post[] }> {
  const groups = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.pubDate.getFullYear();
    const bucket = groups.get(year);
    if (bucket) bucket.push(post);
    else groups.set(year, [post]);
  }
  return [...groups.entries()]
    .map(([year, list]) => ({ year, posts: list }))
    .sort((a, b) => b.year - a.year);
}
