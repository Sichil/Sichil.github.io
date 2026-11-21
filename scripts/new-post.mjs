#!/usr/bin/env node
/**
 * 本地新建一篇文章：把 frontmatter 和日期都填好，省得手抄格式。
 *
 *   pnpm new                              # 一路回车，按提示填
 *   pnpm new "下第一场雪的时候"            # 只给标题
 *   pnpm new "下第一场雪的时候" --slug first-snow --desc "一句话摘要"
 *
 * 生成的文件在 src/content/posts/ 下，文件名就是网址。
 */
import { execSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';

const repoRoot = path.resolve(import.meta.dirname, '..');
const postsDir = path.join(repoRoot, 'src', 'content', 'posts');

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    slug: { type: 'string' },
    desc: { type: 'string' },
    draft: { type: 'boolean', default: false },
    help: { type: 'boolean', default: false },
  },
});

if (values.help) {
  console.log(`用法：
  pnpm new                          交互式填写
  pnpm new "文章标题"                只给标题
  pnpm new "文章标题" --slug my-post --desc "摘要"
  选项：--slug 文件名（网址） --desc 摘要 --draft 存成草稿
`);
  process.exit(0);
}

/** 2026-11-21 这种本地日期 */
function today() {
  const now = new Date();
  const pad = (n) => `${n}`.padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** 把标题变成能放进网址的文件名；中文标题会得到空字符串，交给日期兜底 */
function slugify(text) {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function ensureUnique(baseSlug) {
  let slug = baseSlug;
  let counter = 2;
  while (existsSync(path.join(postsDir, `${slug}.md`))) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return slug;
}

async function openInEditor(file) {
  for (const command of ['code', 'cursor']) {
    try {
      execSync(`${command} -r "${file}"`, { stdio: 'ignore' });
      return command;
    } catch {
      /* 编辑器没装就算了 */
    }
  }
  return null;
}

try {
  await mkdir(postsDir, { recursive: true });

  // 只有真终端才提问；被管道/脚本调用时不问，避免卡死
  const interactive = process.stdin.isTTY === true;
  const rl = interactive
    ? createInterface({ input: process.stdin, output: process.stdout })
    : null;
  const ask = async (question) => {
    if (!rl) return '';
    try {
      return (await rl.question(question)).trim();
    } catch {
      return '';
    }
  };

  let title = positionals.join(' ').trim();
  if (!title) title = await ask('文章标题：');
  if (!title) {
    console.error('没有拿到标题，已退出。用法：pnpm new "文章标题"');
    process.exit(1);
  }

  const date = today();
  const fallbackSlug = `post-${date}-${`${Date.now()}`.slice(-4)}`;
  let slug = values.slug ? slugify(values.slug) || values.slug : slugify(title) || fallbackSlug;

  if (!values.slug && interactive) {
    const answer = await ask(`文件名（就是网址，直接回车用 ${slug}）：`);
    if (answer) slug = slugify(answer) || answer;
  }

  let description = values.desc ?? null;
  if (description === null && interactive) description = await ask('摘要（可留空，回车跳过）：');

  rl?.close();

  slug = await ensureUnique(slug);
  const filePath = path.join(postsDir, `${slug}.md`);
  const relative = path.relative(repoRoot, filePath).replaceAll('\\', '/');

  const frontmatter = ['---', `title: ${title}`];
  if (description) frontmatter.push(`description: ${description}`);
  frontmatter.push(`pubDate: ${date}`);
  if (values.draft) frontmatter.push('draft: true');
  frontmatter.push('---', '', '在这里开始写正文。', '');

  await writeFile(filePath, frontmatter.join('\n'), 'utf8');

  const openedWith = await openInEditor(filePath);

  console.log('');
  console.log(`✓ 已创建 ${relative}`);
  console.log(`  标题：${title}`);
  console.log(`  网址：/posts/${slug}/${values.draft ? '（草稿，不会发布）' : ''}`);
  console.log('');
  console.log('下一步：');
  console.log('  pnpm dev                          本地预览，边写边看');
  console.log(`  git add -A && git commit -m "新文章：${title}" && git push`);
  if (openedWith) console.log(`\n（已用 ${openedWith} 打开这个文件）`);
} catch (error) {
  console.error('新建文章失败：', error instanceof Error ? error.message : error);
  process.exit(1);
}
