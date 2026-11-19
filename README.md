# Fanggg's Blog

Fanggg 的個人部落格：https://mu0524.github.io/

記錄前端開發的筆記與踩坑心得，以 [Astro](https://astro.build/) 建置。

## 主題

部落格主題的版面、配色、文章卡片與頁尾由 Fanggg 自行設計，先在 Figma 畫好設計稿，再從頭撰寫程式碼實作：

- 樣式：各元件內的 SCSS，色票集中在 `src/styles/variables.scss`
- 互動：原生 TypeScript（深色模式、站內搜尋、文章目錄、圖片燈箱、換頁轉場）
- Markdown 擴充：GitHub 提示框、`:::codepen` 內嵌範例、`::github` 專案卡片（`src/plugins/`）

## 開發

```bash
pnpm install
pnpm dev                 # 開發伺服器（站內搜尋要 build 後才能用）
pnpm build               # 建置到 dist/ 並產生 Pagefind 搜尋索引
pnpm check               # Astro 與 TypeScript 型別檢查
pnpm new-post <slug>     # 建立 src/content/posts/<slug>/index.md
```

網站名稱、導覽連結、每頁文章數等設定在 `src/site.config.ts`。

## 版權宣告

| 範圍 | 版權與授權 |
|---|---|
| 程式碼與主題視覺設計 | © 2026 Fanggg. All Rights Reserved. 包含程式碼、版面、配色與元件樣式，未經同意請勿使用於其他網站或作品 |
| 文章內容 | 依 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 授權：轉載請註明出處與原文連結、不得用於商業用途，改作須以相同授權釋出 |
| 插圖與圖片 | 首頁兔子、頁尾熊等插圖與文章中引用的他人圖片非本人創作，版權屬原作者所有，不在上述授權範圍內 |
| 第三方套件與圖示 | Astro、Expressive Code、Pagefind、PhotoSwipe、Swup、Material Symbols 等，依各自的授權使用 |

完整內容見 [LICENSE.txt](LICENSE.txt)。
