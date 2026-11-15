/**
 * ============================================================
 *  站点配置：改这里就够了
 * ============================================================
 *  改完之后存盘，`pnpm dev` 的页面会自动刷新；
 *  推送到 GitHub 后，网站大约 1 分钟内自动更新。
 */

export const site = {
  /** 浏览器标签页显示的站名，也是首页大标题 */
  title: '雪夜小站',
  /** 首页标题下面的一句话 */
  tagline: '在雪落下的声音里，写一点自己的东西。',
  /** 搜索引擎和分享卡片上的简介 */
  description: 'Sichil 的个人博客：记录代码、阅读，以及一些没头没尾的念头。',
  /** 你的名字，显示在页脚和文章署名处 */
  author: 'Sichil',
  /** 头像图片（可选）。把图片放进 public/images/，然后填 '/images/avatar.jpg' */
  avatar: '',

  /** 顶部导航。想加一个页面就在这里加一项 */
  nav: [
    { label: '首页', href: '/' },
    { label: '全部文章', href: '/posts/' },
    { label: '关于', href: '/about/' },
  ],

  /** 页脚说明文字（年份和作者会自动加在前面） */
  footer: '用 Astro 写成 · 托管在 GitHub Pages',

  /**
   * 雪景参数，微调手感用：
   *  density 雪花数量  0.2 ~ 2     （默认 1）
   *  speed   下落速度  0.5 ~ 2
   *  wind    左右飘动  0 ~ 2
   *  stars   星星数量  0 ~ 2
   */
  snow: {
    enabled: true,
    density: 1,
    speed: 1,
    wind: 1,
    stars: 1,
  },
} as const;

export type SiteConfig = typeof site;
