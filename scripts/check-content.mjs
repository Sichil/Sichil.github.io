#!/usr/bin/env node
/**
 * 构建前的自检：防止把文章放到错误的目录里。
 *
 * 曾经踩过的坑：文章被建到了 src/pages/posts/snow1（既没有 .md 后缀，
 * 目录也不对）。网站不会报错，只是这篇文章默默消失了。
 *
 * 这个脚本会在 pnpm build / pnpm dev 之前跑：
 *   - 硬错误（退出码 1）：目录放错、扩展名不对
 *   - 警告（不影响构建）：frontmatter 缺字段
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const postsDir = path.join(root, 'src', 'content', 'posts');
const routesDir = path.join(root, 'src', 'pages', 'posts');

const errors = [];
const warnings = [];

async function walk(dir, prefix = '') {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await walk(path.join(dir, entry.name), relative)));
    } else if (entry.isFile()) {
      files.push(relative);
    }
  }
  return files;
}

const postFiles = await walk(postsDir);

for (const file of postFiles) {
  if (!file.endsWith('.md')) {
    errors.push(
      `src/content/posts/${file}：文章必须是 .md 文件（例如 my-post.md），否则不会被识别`,
    );
    continue;
  }

  const text = await readFile(path.join(postsDir, file), 'utf8');
  const lines = text.split(/\r?\n/).slice(0, 20);
  const hasFrontmatter = lines[0]?.trim() === '---' && lines.includes('---');
  if (!hasFrontmatter) {
    warnings.push(`src/content/posts/${file}：没有 frontmatter（开头的 --- 那段），可能缺少标题和日期`);
    continue;
  }
  if (!lines.some((line) => /^title\s*:/.test(line))) {
    warnings.push(`src/content/posts/${file}：frontmatter 里缺 title`);
  }
  if (!lines.some((line) => /^pubDate\s*:/.test(line))) {
    warnings.push(`src/content/posts/${file}：frontmatter 里缺 pubDate`);
  }
}

const routeFiles = await walk(routesDir);
for (const file of routeFiles) {
  if (!file.endsWith('.astro')) {
    errors.push(
      `src/pages/posts/${file}：这个目录只放 .astro 页面代码，文章请放到 src/content/posts/`,
    );
  }
}

for (const message of warnings) console.warn(`⚠ ${message}`);

if (errors.length > 0) {
  console.error('');
  for (const message of errors) console.error(`✗ ${message}`);
  console.error('\n修好上面的问题再构建。');
  process.exit(1);
}

console.log(`✓ 内容检查通过（${postFiles.length} 篇文章）`);
