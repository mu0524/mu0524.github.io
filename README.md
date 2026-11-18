# Fanggg's Blog

以 [Astro](https://astro.build/) + [Fumika](https://github.com/iyanarmanda/fumika) 主題建置的個人部落格，透過 GitHub Actions 自動部署到 GitHub Pages：https://mu0524.github.io/

## 環境需求

- Node.js 22.23.4 以上（Astro 7.4 的要求）
- pnpm 11（專案強制使用 pnpm，`npm install -g pnpm`）

## 快速開始

```bash
pnpm install          # 安裝依賴（會順便下載 Mermaid 圖表建置用的 Chromium）
pnpm dev              # 開發伺服器 http://localhost:4321
pnpm build            # 建置靜態網站到 dist/
pnpm preview          # 預覽建置結果
pnpm new-post <檔名>   # 新增文章到 src/content/posts/
```

> 搜尋（Pagefind）需要先 `pnpm build` 才能在 `pnpm preview` 中測試。

## 常改的檔案

| 檔案 | 用途 |
|------|------|
| `src/config.ts` | 網站標題、語系、主題色、橫幅、導覽列、個人資料、留言、網址 |
| `src/content/posts/` | 文章（Markdown / MDX） |
| `src/content/spec/about.md` | 關於我頁面 |
| `src/content/spec/friends.md`、`src/content/data/friends.json` | 友站連結頁面 |
| `src/assets/images/` | 頭像、橫幅圖片 |

## 樣式

樣式檔放在 `src/styles/`，以 SCSS 撰寫。以下兩個檔案依賴 Tailwind CSS 的編譯指令（`@import "tailwindcss"`、`@theme`、`@utility`、`@apply`），Tailwind v4 不支援經過 Sass 處理，因此維持 `.css`：

- `main.css`：Tailwind 進入點與自訂 utility
- `markdown.css`：文章內文排版

`src/styles/` 底下的檔案會被主題自動載入（`src/components/misc/ImageWrapper.astro` 的 `import.meta.glob`），新增樣式檔不需要另外 import。

## 部署

推送到 `master` 或 `main` 分支後，`.github/workflows/gh-pages.yml` 會自動建置並部署到 GitHub Pages。
首次使用需在 repo 的 **Settings → Pages → Source** 選 **GitHub Actions**。

## 授權

主題 Fumika 採 MIT 授權，見 [LICENSE.txt](LICENSE.txt)。
