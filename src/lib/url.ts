/**
 * 站内链接助手。
 *
 * GitHub Pages 有两种部署位置：
 *   1. 仓库名为 `<用户名>.github.io`      → 站点在根路径  https://user.github.io/
 *   2. 其他仓库名，例如 `blog`            → 站点在子路径  https://user.github.io/blog/
 *
 * 第二种情况下写死 `/posts/` 会 404，所以站内链接一律走这个函数。
 * Astro 会把 base 注入到 import.meta.env.BASE_URL（本地开发时是 '/'）。
 */
export function url(path = ''): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const clean = String(path).replace(/^\/+/, '');
  if (!clean) return `${base}/`;
  return `${base}/${clean}`;
}
