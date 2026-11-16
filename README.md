# 雪夜小站 · 一个黑底飘雪的个人博客

> 线上地址：**https://Sichil.github.io/**　·　  仓库：**https://github.com/Sichil/Sichil.github.io**

一个开箱即用的个人博客：黑色夜空、星星、慢慢飘下来的雪，内容全部用 Markdown 写作，托管在 GitHub Pages 上（免费、无需服务器）。

- 文章 = `src/content/posts/` 下的一个 `.md` 文件
- 站点名字、简介、导航、雪的大小 = `src/config.ts` 一个文件
- 颜色、字号、圆角 = `src/styles/global.css` 最上面的变量
- 推送到 GitHub 后自动构建发布，不需要在电脑上点"部署"

---

## 一、本地预览（可选，但有它改起来最舒服）

需要 **Node.js 22.23 或更高版本**（`node -v` 查看）和 pnpm（`npm i -g pnpm`）。

```bash
cd snow-blog
pnpm install       # 第一次运行时装依赖，只需要一次
pnpm dev           # 打开 http://localhost:4321 边改边看
```

想看成品的静态版本：

```bash
pnpm build         # 生成到 dist/ 目录
pnpm preview       # 用本地服务器预览 dist/
```

> 不想装任何东西也完全可以：直接在 GitHub 网页上改文件、提交，一样会自动发布。

---

## 二、写一篇文章

1. 在 `src/content/posts/` 里新建一个 `.md` 文件，比如 `first-snow.md`
2. 开头写上这段（`---` 之间的部分叫 frontmatter）：

```markdown
---
title: 下第一场雪的时候
description: 一句话摘要，会显示在文章列表里
pubDate: 2026-11-20
---

正文从这里开始，用普通的 Markdown 写就行。

## 小标题

- 列表
- **加粗**
- [链接](https://example.com)
```

3. 保存（或提交）之后，网址就是 `/posts/first-snow/`，首页也会自动出现这篇。

### frontmatter 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `description` | 否 | 摘要，显示在列表、搜索和分享卡片里 |
| `pubDate` | 是 | 发布日期，写成 `2026-11-20` |
| `updatedDate` | 否 | 修改日期，填了会在文章页显示"更新于" |
| `draft` | 否 | 写 `true` 就是草稿，不会出现在网站上 |

### 几个约定

- **文件名就是网址**：建议用英文、数字和连字符（`winter-notes.md`）。用中文也能生成，但网址会变成 `%E4%B8%AD%E6%96%87` 这种样子，分享出去不好看。
- **大小写敏感**：`Hello.md` 和 `hello.md` 是两个不同的网址。
- **发布顺序**：按 `pubDate` 从新到旧排；`pubDate` 写成未来日期的文章会等到那天才出现。

### 在 GitHub 网页上直接写（不用电脑装东西）

仓库页面 → 进入 `src/content/posts/` → 右上角 **Add file → Create new file** → 输入 `随便一个名字.md` → 粘贴上面的模板 → 底部 **Commit changes**。等 Actions 跑完（约 1 分钟），网站就更新了。

手机上也能这么写。

---

## 三、改站点信息

打开 `src/config.ts`：

| 字段 | 作用 |
| --- | --- |
| `title` | 站名：浏览器标签、页头、首页大标题 |
| `tagline` | 首页标题下面那句话 |
| `description` | 搜索引擎和分享卡片的简介 |
| `author` | 你的名字，显示在页脚 |
| `avatar` | 头像路径（例如 `/images/avatar.jpg`），留空就不显示 |
| `nav` | 顶部导航，可以增删项目 |
| `footer` | 页脚后半句说明 |
| `snow` | 雪景参数，见下一节 |

导航想加一页？先在 `src/pages/` 里建对应页面，再往 `nav` 里加一项，例如：

```ts
{ label: '读书', href: '/books/' },
```

---

## 四、调整外观

### 颜色与排版

`src/styles/global.css` 开头的 `:root` 里都是变量，改数值即可：

```css
--sky-top: #04060d;      /* 夜空最上面（最黑） */
--sky-horizon: #101a33;  /* 靠近地平线的微光 */
--ink: #e9eef8;          /* 正文颜色 */
--ink-muted: #a6b2c8;    /* 次要文字 */
--accent: #8ab4ff;       /* 链接和强调色 */
--max-width: 46rem;      /* 正文最大宽度，调大更宽松 */
--radius: 16px;          /* 卡片圆角 */
```

### 雪与星星

```ts
snow: {
  enabled: true,   // false 就只剩星空
  density: 1,      // 雪花数量：0.2（稀疏）~ 2（大雪）
  speed: 1,        // 下落速度：0.5（慢）~ 2（快）
  wind: 1,         // 左右飘动幅度：0（直落）~ 2
  stars: 1,        // 星星数量：0 ~ 2
}
```

系统开启「减少动态效果」（`prefers-reduced-motion`）时，雪花会自动变成静止画面，这是刻意做的，省电也不晃眼。

---

## 五、放图片

1. 把图片放进 `public/images/`，比如 `public/images/snow.jpg`
2. 文章里这样引用：`![雪](/images/snow.jpg)`

因为这个仓库名是 `Sichil.github.io`（用户站点，网站在根路径），`/images/xxx.jpg` 这种写法直接就能用，不需要加任何前缀。

---

## 六、目录结构

```
snow-blog/
├─ .github/workflows/deploy.yml   # 推送到 main 后自动构建并发布
├─ astro.config.mjs               # 站点地址与 base（自动推断，一般不用改）
├─ public/
│  ├─ favicon.svg                 # 浏览器标签图标
│  └─ images/                     # 自己放的图片
└─ src/
   ├─ config.ts                   # ★ 站点信息：站名、简介、导航、雪量
   ├─ content.config.ts           # 文章字段的校验规则
   ├─ content/
   │  ├─ posts/                   # ★ 文章（一个 .md 一篇）
   │  └─ pages/about.md           # ★ 「关于」页的内容
   ├─ layouts/BaseLayout.astro    # 页面骨架：head、页头、页脚、雪层
   ├─ components/
   │  ├─ SnowSky.astro            # 夜空 + 星星 + 飘雪
   │  ├─ SiteHeader.astro
   │  ├─ SiteFooter.astro
   │  └─ PostCard.astro
   ├─ lib/                        # 文章排序、日期格式化、链接拼接
   ├─ pages/                      # 网址与页面一一对应
   │  ├─ index.astro              # 首页
   │  ├─ posts/index.astro        # 全部文章
   │  ├─ posts/[...id].astro      # 文章详情
   │  ├─ about.astro
   │  └─ 404.astro
   └─ styles/global.css           # ★ 配色与排版
```

---

## 七、发布与更新

这个站点已经接在 **https://github.com/Sichil/Sichil.github.io** 上，Pages 的 Source 是 **GitHub Actions**。

### 日常更新（绝大多数时候只需要这一步）

```bash
cd D:\DSHwork\snow-blog
git add -A
git commit -m "写点什么"
git push
```

推完等 1～2 分钟，https://Sichil.github.io/ 自动更新。
也可以直接在 GitHub 网页上改文件、提交，效果完全一样。

### 第一次是怎么接上去的（留档，不用再做）

1. `gh auth login` 授权 GitHub CLI（`repo`、`workflow` 权限）
2. `gh repo create Sichil.github.io --public --source . --remote origin --push`
3. 仓库 Settings → Pages → Source 选 **GitHub Actions**
4. Actions 里的 "Deploy to GitHub Pages" 跑完，站点上线

### 换一台电脑继续写

```bash
git clone https://github.com/Sichil/Sichil.github.io.git
cd Sichil.github.io
pnpm install
pnpm dev
```

---

## 八、常见问题

**Actions 里是红叉（构建失败）**
点进那条失败记录，展开红色步骤看报错。最常见的原因是 frontmatter 少字段或日期写错（例如 `pubDate: 2026-13-40`）。报错里会指出是哪个文件。

**推送后网站没变化**
- Actions 是否跑完？Pages 是否选成了 GitHub Actions？
- 浏览器缓存：`Ctrl + F5` 强制刷新
- 刚建仓库的前几分钟，Pages 有时需要等一会儿

**页面 404**
- 本仓库是用户站点（`Sichil.github.io`），网址在根路径，`base` 由构建设置自动推断，正常情况不用管
- 文章改名会换网址，旧链接自然就 404 了
- 新文章刚推上去还没构建完时，也可能短暂 404

**仓库是 Private 可以吗**
GitHub Pages 对私有仓库的站点发布需要付费方案。个人博客建议直接用 Public 仓库，代码公开也没什么损失。

**想换域名**
1. 在域名服务商处把域名 CNAME 到 `Sichil.github.io`
2. 在 `public/` 下新建 `CNAME` 文件，里面写一行你的域名
3. 仓库 Settings → Pages → Custom domain 填入域名
4. 在 `astro.config.mjs` 里把 `site` 改成 `https://你的域名`，并把 `base` 设为 `'/'`

**改坏了想退回**
每一版都在 git 里。`git log` 看历史，`git checkout <提交号> -- 文件路径` 取回单个文件，或者 `git revert` 撤销某次提交。

---

## 九、技术说明（可以跳过）

- [Astro 7](https://astro.build/) 静态构建，产物是纯 HTML/CSS + 一个几 KB 的脚本
- 主题：黑色夜空 + 星点 + 三层视差雪花，`<canvas>` 绘制，在 `prefers-reduced-motion` 下降级为静态画面，页面不可见时自动暂停
- 无外部 CDN 依赖（不用 Google Fonts、不用图标库），国内访问也快
- Markdown 由 Astro 的 Sätteri 管线渲染，代码块带 Shiki 高亮
- 部署：`withastro/action` + `actions/deploy-pages`
