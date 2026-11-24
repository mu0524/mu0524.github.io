# Fanggg's Blog

Fanggg 的個人部落格：https://mu0524.github.io/

記錄前端開發的筆記與踩坑心得。以 [Astro](https://astro.build/) 建置，主題先在 Figma 畫好設計稿，再從頭撰寫程式碼實作。

<br>

## 快速開始

需要 Node.js 22 以上與 pnpm（`preinstall` 會擋下 npm、yarn）。

```bash
pnpm install    # 安裝依賴
pnpm dev        # 啟動開發伺服器 (http://localhost:4321)
pnpm build      # 建置靜態網站到 dist/，並產生 Pagefind 搜尋索引
pnpm preview    # 預覽建置結果
```

> **注意**：站內搜尋（Pagefind）的索引在 `pnpm build` 時產生，要用 `pnpm preview` 才測得到，`pnpm dev` 下無法搜尋。

其他指令：

| 指令 | 說明 |
|------|------|
| `pnpm watch` | 監看 `src/`、`public/` 變動，存檔後自動重新 build（搭配 WAMP 的 `fanggg.test` 預覽 `dist/`） |
| `pnpm check` | Astro 與 TypeScript 型別檢查 |
| `pnpm lint` | Biome 檢查並自動修正 `src/` |
| `pnpm format` | Biome 格式化 `src/` |
| `pnpm new-post <slug>` | 建立新文章 |

<br>

## 專案結構

```
├── .github/
│   ├── workflows/
│   │   ├── biome.yml                # CI: Biome 程式碼品質檢查
│   │   ├── build.yml                # CI: astro check + build (Node 22/24)
│   │   └── gh-pages.yml             # GitHub Pages 自動部署
│   └── dependabot.yml               # 每週檢查 npm 依賴更新
├── .vscode/                         # 推薦擴充套件 (Biome + Astro) 與格式化設定
├── docs/
│   ├── character/                   # 吉祥物兔子角色設定圖
│   ├── codepen.md                   # 文章內嵌 CodePen 範例的寫法
│   └── notion-import.md             # Notion 匯出文章的轉換流程
├── public/
│   └── favicon/fav-ico.png          # Favicon
├── scripts/
│   ├── new-post.js                  # 新增文章腳本
│   └── watch-build.js               # pnpm watch：存檔後自動重新 build
├── src/
│   ├── assets/images/theme/         # 主題用圖片與圖示（會被 Astro 優化）
│   ├── components/                  # UI 元件（Header、Footer、文章卡片、目錄、搜尋等）
│   ├── content/
│   │   ├── posts/                   # ⭐ 部落格文章，一篇一個資料夾
│   │   │   └── <slug>/
│   │   │       ├── index.md         #    文章內文
│   │   │       └── cover.png        #    文章用圖放同一個資料夾
│   │   └── pages/
│   │       └── about.md             # ⭐ 關於我
│   ├── content.config.ts            # Content Collections schema（frontmatter 欄位）
│   ├── layouts/                     # 頁面佈局
│   ├── lib/                         # 文章查詢、日期、網址工具
│   ├── pages/                       # 路由
│   │   ├── [...page].astro          # 首頁（分頁文章列表）
│   │   ├── posts/[...slug].astro    # 文章內頁
│   │   ├── archive.astro            # 文章彙整頁
│   │   ├── about.astro              # 關於我
│   │   ├── 404.astro                # 404 頁
│   │   ├── rss.xml.ts               # RSS
│   │   └── robots.txt.ts            # robots.txt
│   ├── plugins/                     # Markdown 擴充（提示框、CodePen、GitHub 卡片、字數）
│   ├── scripts/                     # 前台互動（目錄、燈箱、彙整篩選、換頁）
│   ├── styles/                      # 全域樣式與 SCSS 變數
│   └── site.config.ts               # ⭐ 網站設定，見下方「修改網站設定」
├── astro.config.mjs                 # Astro 框架設定
├── biome.jsonc                      # Biome linter 設定
└── CLAUDE.md                        # 文章插圖風格規範（黑灰白編輯極簡・柔霧插畫風）
```

<br>

## 技術架構

| 元件 | 技術 |
|------|------|
| 框架 | [Astro 7](https://astro.build/) - 靜態網站產生器 |
| 樣式 | SCSS - 寫在各元件內，色票集中在 `src/styles/variables.scss` |
| 互動 | 原生 TypeScript - 深色模式、文章目錄、彙整篩選 |
| 程式碼高亮 | Expressive Code - 行號、摺疊 |
| 搜尋 | Pagefind - 建置時產生索引，在瀏覽器端搜尋 |
| 頁面轉場 | Swup - 不重新整理頁面的換頁 |
| 圖片燈箱 | PhotoSwipe |
| 圖示 | Material Symbols（astro-icon） |
| 字體 | Jaldi、Roboto（英數）、Noto Sans TC 400～700（中文）、JetBrains Mono（程式碼），皆以 Fontsource 自行提供 |
| 程式碼檢查 | Biome、`astro check` |
| 部署 | GitHub Pages + GitHub Actions 自動建置 |

<br>

## 日常維護

### 新增文章

```bash
pnpm new-post css-grid-notes
```

會建立 `src/content/posts/css-grid-notes/index.md`。資料夾名稱就是網址代稱，只能用小寫英數字與連字號。產生的 frontmatter 如下：

```markdown
---
title: css-grid-notes
published: 2026-11-20
description: ''
image: ''
tags: []
category: ''
subcategory: ''
draft: true
---

文章內容...
```

寫完把 `draft` 改成 `false` 才會發布。

#### Frontmatter 欄位一覽

| 欄位 | 必填 | 說明 |
|------|------|------|
| `title` | 是 | 文章標題 |
| `published` | 是 | 發布日期（`YYYY-MM-DD`） |
| `updated` | 否 | 更新日期（`YYYY-MM-DD`） |
| `description` | 否 | 文章摘要，用於 SEO 與文章列表 |
| `image` | 否 | 封面圖，用相對路徑引用同資料夾的圖，例：`./cover.png` |
| `tags` | 否 | 標籤陣列，可多個 |
| `category` | 否 | 分類 |
| `subcategory` | 否 | 子分類 |
| `draft` | 否 | 草稿，設 `true` 時正式建置不會發布，`pnpm dev` 下仍會顯示（預設 `false`） |

> 文章間連結：使用 `/posts/<slug>/` 格式

#### Markdown 擴充語法

| 語法 | 用途 | 說明 |
|------|------|------|
| `> [!NOTE]` 等 | GitHub 提示框 | 支援 NOTE、TIP、IMPORTANT、WARNING、CAUTION |
| `:::codepen` | 內嵌可操作的 CodePen 範例 | 見 [docs/codepen.md](docs/codepen.md) |
| `::github{repo="owner/repo"}` | GitHub 專案卡片 | 描述、星星數等資料在瀏覽器端向 GitHub API 取得 |

從 Notion 匯入文章前，先看 [docs/notion-import.md](docs/notion-import.md)。

### 修改網站設定

編輯 `src/site.config.ts`：

| 設定 | 用途 |
|------|------|
| `SITE` | 網站名稱、副標、描述、作者、網址、GitHub 連結、首頁每頁文章數、文章目錄層數 |
| `LICENSE` | 文章授權（顯示在每篇文章底部） |
| `NAV_LINKS` | 導覽列連結 |

### 修改關於頁

直接編輯 `src/content/pages/about.md`。

### 圖片管理

| 類型 | 位置 | 引用方式 |
|------|------|----------|
| 文章內用圖 | `src/content/posts/<slug>/` | `![alt](./filename.png)`，由 Astro 自動壓縮優化 |
| 主題圖片與圖示 | `src/assets/images/theme/` | 在元件中 import；頭貼 `profile.png`、頁尾動畫 `bunny-walking.gif` |
| 預設分享圖 | `src/assets/images/theme/og-default.png` | 沒有封面的頁面分享到社群時用這張，1200×630、不透明背景 |
| Favicon | `public/favicon/fav-ico.png` | 原樣輸出，建議 192×192 |

> GIF 動畫不要用 Astro 的 `<Image>`，轉檔後會變成靜態圖，改用 `<img src={匯入的圖.src}>` 輸出原檔（見 `Footer.astro`）。
>
> 文章封面與插圖的風格規範寫在 `CLAUDE.md`：封面固定 16:9，輸出 1920×1080。

<br>

## 部署

### GitHub Actions 自動建置

push 到 `master` 分支後，GitHub Actions 會自動建置並部署（`.github/workflows/gh-pages.yml`）：

1. 使用 `withastro/action` 安裝依賴並執行 `pnpm build`，產生 `dist/`
2. 上傳 artifact 後部署到 GitHub Pages

也可以在 GitHub Actions 頁面手動觸發（`workflow_dispatch`）。

> **注意**：`gh-pages.yml` 是獨立的部署流程，不受下方 CI workflow 的結果影響。即使 `build.yml` 或 `biome.yml` 失敗，部署仍會照常執行。

### CI Workflows

push 與 PR 到 `master` 時自動執行，只做檢查，不影響部署：

| Workflow | 檔案 | 用途 |
|----------|------|------|
| Build and Check | `build.yml` | 在 Node 22/24 上跑 `pnpm check` 與 `pnpm build` |
| Code quality | `biome.yml` | Biome 檢查 `./src` 下的程式碼品質 |

### Dependabot

`dependabot.yml` 設定每週檢查 npm 依賴的 patch／minor 更新，並分組開 PR。major 版本更新會被略過，避免破壞性升級。

### GitHub 儲存庫設定

| 設定位置 | 值 |
|----------|-----|
| Settings → Pages → Source | **GitHub Actions**（不是 Deploy from a branch） |

<br>

## 授權

| 項目 | 授權 |
|------|------|
| 程式碼與主題設計 | 保留所有權利，未經同意請勿使用於其他網站或作品 |
| 文章內容 | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)（顯示在每篇文章底部） |
| 網站插圖 | 頭貼、頁尾兔子動畫、文章封面與插圖，未經同意請勿使用 |
| 引用圖片 | 文章中引用的他人圖片，版權屬原作者所有 |
| 字體 | Jaldi、Roboto、Noto Sans TC、JetBrains Mono，皆為 OFL 1.1 |
| 第三方套件 | Astro、Expressive Code、Pagefind、PhotoSwipe、Swup、Material Symbols 等，依各自授權使用 |

完整內容見 [LICENSE.txt](LICENSE.txt)。
