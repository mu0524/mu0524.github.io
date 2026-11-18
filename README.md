# Fanggg's Blog

以 [Astro](https://astro.build/) + [Firefly](https://github.com/CuteLeaf/Firefly) 主題建置的個人部落格，透過 GitHub Actions 自動部署到 GitHub Pages。

## 環境需求

- Node.js 22 以上
- pnpm 11（專案強制使用 pnpm，`npm install -g pnpm@11.22.0`）

## 快速開始

```bash
pnpm install          # 安裝依賴
pnpm dev              # 開發伺服器 http://localhost:4321
pnpm build            # 建置靜態網站到 dist/
pnpm preview          # 預覽建置結果
pnpm new-post <檔名>   # 新增文章到 src/content/posts/
```

> 搜尋（Pagefind）需要先 `pnpm build` 才能在 `pnpm preview` 中測試。

## 常改的檔案

| 檔案 | 用途 |
|------|------|
| `src/config/siteConfig.ts` | 網站標題、網址、語系、主題色、頁面開關 |
| `src/config/profileConfig.ts` | 頭像、名字、簽名、社群連結 |
| `src/config/navBarConfig.ts` | 導覽列選單 |
| `src/config/sidebarConfig.ts` | 側邊欄元件 |
| `src/content/posts/` | 文章（Markdown / MDX） |
| `src/content/spec/about.md` | 關於我頁面 |

主題完整設定說明見 [Firefly 文件](https://docs-firefly.cuteleaf.cn/)。

## 部署到 GitHub Pages

1. 在 GitHub 建立 repo（建議命名為 `<帳號>.github.io`，網址就是 `https://<帳號>.github.io/`）
2. 把 `src/config/siteConfig.ts` 的 `site_url` 改成你的網址
3. 推送程式碼：
   ```bash
   git remote add origin https://github.com/<帳號>/<帳號>.github.io.git
   git push -u origin master
   ```
4. 到 repo 的 **Settings → Pages → Build and deployment → Source** 選 **GitHub Actions**

之後每次推送到 `master` 或 `main`，`.github/workflows/deploy.yml` 會自動建置並部署。

## 授權

主題 Firefly 採 MIT 授權，見 [LICENSE](LICENSE)。
