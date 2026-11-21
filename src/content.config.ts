import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 后台编辑器（Pages CMS）把留空的日期字段写成 `''`，
 * 这里统一把空字符串/空值当成"没填"，避免构建因为一个空日期直接失败。
 */
const optionalDate = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? undefined : value),
  z.coerce.date().optional(),
);

/** 摘要同理：允许留空、也允许不写这个字段 */
const optionalText = z.preprocess(
  (value) => (value === null || value === undefined ? undefined : value),
  z.string().optional(),
);

/**
 * 文章集合：src/content/posts/ 下的每一个 .md 文件就是一篇博客。
 * 文件名会变成网址：november-snow.md → /posts/november-snow/
 */
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: optionalText,
    pubDate: z.coerce.date(),
    updatedDate: optionalDate,
    draft: z.boolean().default(false),
  }),
});

/** 独立页面：目前只有「关于」页，内容同样用 Markdown 编辑 */
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: optionalText,
  }),
});

export const collections = { posts, pages };
