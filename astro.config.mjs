// @ts-check
import { defineConfig } from 'astro/config';

/**
 * 站点地址会从运行环境里自动推断，正常情况下你不需要改这个文件。
 *
 * - 在 GitHub Actions 里构建时，owner 和仓库名来自 GITHUB_REPOSITORY / GITHUB_REPOSITORY_OWNER；
 * - 仓库名刚好是 `<用户名>.github.io` 时，站点在根路径（base = '/'）；
 * - 其他仓库名（例如 `blog`）时，站点在子路径（base = '/blog/'），站内链接由 src/lib/url.ts 自动补前缀；
 * - 本地 `pnpm dev` / `pnpm build` 没有这些环境变量，退化为 base = '/'。
 *
 * 想绑定自定义域名？把 SITE 环境变量设成 https://your-domain.com，或直接改下面的 site 与 base。
 */
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? 'your-github-name';
const repo = (process.env.GITHUB_REPOSITORY ?? '').split('/')[1] ?? '';
const isUserSite = repo.toLowerCase() === `${owner}.github.io`.toLowerCase();

const site = process.env.SITE ?? `https://${owner}.github.io`;
const base = process.env.BASE ?? (isUserSite || !repo ? '/' : `/${repo}/`);

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
  vite: {
    define: {
      // 文章页底部的「在 GitHub 上编辑此页」链接需要它；本地构建时为空字符串。
      __GITHUB_REPOSITORY__: JSON.stringify(process.env.GITHUB_REPOSITORY ?? ''),
    },
  },
});
