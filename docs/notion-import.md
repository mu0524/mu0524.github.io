# Notion 匯出文章轉成部落格文章的注意事項

Notion 匯出的 Markdown 不能直接丟進 `src/content/posts/`，以下是實際轉換時踩到的問題與處理方式。

## 轉換流程速查

1. 用 Python 解壓縮 zip（不要用 Git Bash 的 `unzip`，原因見下方第 1 點）
2. 檔名改成英文 slug，例：`lch-vs-rgb-gradient.md`
3. 刪掉第一行的 `# 標題`，改寫成 frontmatter
4. 照下方清單逐項檢查內文
5. `pnpm build` 確認可以建置，再到 `dist/posts/{slug}/index.html` 或 `pnpm dev` 看實際畫面

## 坑與處理方式

### 1. 解壓縮後中文檔名變亂碼

- 狀況：Git Bash 內建的 `unzip` 解出來的檔名是亂碼（例：`þé¦õ+Çڦ...md`）。zip 內其實有標記 UTF-8，是 `unzip` 在 Windows 上沒有正確處理
- 處理：改用 Python `zipfile` 解壓縮，檔名就會正確

```python
import zipfile
with zipfile.ZipFile("article-1.zip") as z:
    z.extractall("out")
```

### 2. 檔名帶有 Notion 的 32 碼 ID

- 狀況：檔名長這樣：`CSS interpolate-size 與 calc-size() 完全指南 344f3cdd5bae805ba458fcdf27308d70.md`，檔名會直接變成網址
- 處理：重新命名成英文 slug（小寫、用 `-` 連接）

### 3. 沒有 frontmatter，標題是內文的 `# H1`

- 狀況：Notion 匯出只有 `# 標題`，沒有 `published`、`tags` 等欄位。`title`、`published` 是必填，缺少就會建置失敗
- 處理：刪掉 `# H1`（文章頁會用 frontmatter 的 `title` 顯示標題，留著會出現兩次標題），補上 frontmatter
- 標題含 `:`、`?`、`#` 等符號時用雙引號包住，避免 YAML 解析錯誤

```yaml
---
title: "文章標題"
published: 2026-11-19
description: 一兩句摘要，會顯示在列表與 SEO description
tags: [CSS, 動畫]
category: 前端開發
subcategory: CSS
draft: false
---
```

### 4. 匯出檔沒有原始發文日期

- 狀況：Notion 匯出的 Markdown 不含建立／編輯日期，zip 檔的時間是匯出當下的時間
- 處理：`published` 要自己填。若想保留原始日期，要回 Notion 查頁面的建立時間

### 5. 引言（callout / quote）後面多一行空的 `>`

- 狀況：每個引言區塊後面都跟著一行只有 `> ` 的空行
- 處理：刪掉。建議順便把 Notion callout 改成主題支援的 GitHub 提示框語法

```markdown
> [!NOTE]
> 一般補充說明

> [!TIP]
> 小技巧

> [!WARNING]
> 注意事項
```

### 6. 程式碼區塊內的網址被加上 `< >`

- 狀況：Notion 把網址自動轉成 autolink，連程式碼區塊裡的字串都會變成 `"<https://...>"`，複製下來的程式碼會直接壞掉
- 處理：全文搜尋 `<https`，把角括號拿掉

```html
<!-- 匯出結果（錯誤） -->
<script src="<https://cdn.jsdelivr.net/npm/xxx.js>"></script>
<!-- 修正後 -->
<script src="https://cdn.jsdelivr.net/npm/xxx.js"></script>
```

### 7. JavaScript 程式碼區塊的語言標記是 `jsx`

- 狀況：Notion 選「JavaScript」匯出後會標成 ` ```jsx `
- 處理：一般 JS 改成 ` ```js `，真的是 React JSX 才保留

### 8. 粗體沒有閉合、換行消失

- 狀況：Notion 區塊內的換行（Shift + Enter）匯出時可能遺失，導致 `**推薦使用方式非常簡單...` 這種只有開頭 `**` 的粗體，畫面會直接顯示星號
- 處理：搜尋落單的 `**`，補回閉合或拆成兩段

### 9. 標題層級被壓平

- 狀況：Notion 只有 H1～H3，原本想表達的第四層標題會跟上一層一樣是 `###`，目錄（TOC）會變成同一層
- 處理：依內容判斷，把子項目改成 `####`

### 10. 圖片沒有 alt、而且是外部連結

- 狀況：匯出的圖片是 `![](https://...)`，沒有替代文字；若圖片是貼網址而非上傳到 Notion，zip 裡不會有圖檔，文章會依賴外部主機
- 處理：補上 alt 描述。外部圖片要注意對方主機搬家或擋外部引用時圖片會失效，重要的圖片建議下載到專案內

### 11. 連結失效、佔位字串沒換掉

- 狀況：
  - Notion 頁面連結會被轉成 `https://app.notion.com/p/...`，公開部落格的讀者打不開
  - 原稿留下的佔位字串（例：`{CODEPEN_URL}`）匯出後變成指向 Notion 的壞連結
  - 外部連結本身可能已經 404（例：Leader Line 的 GitHub 連結作者寫錯）
- 處理：全文搜尋 `notion.com`、`{`、`TODO`；外部連結逐一確認。npm 套件的正確 repo 可以從 npm registry 查

```bash
curl -s https://registry.npmjs.org/leader-line-new | python -c "import json,sys; print(json.load(sys.stdin)['repository'])"
```

- 暫時補不到的內容，可以用 HTML 註解 `<!-- -->` 包起來，畫面上不會顯示（但仍會留在網頁原始碼中）

### 12. 檔案結尾沒有換行

- 狀況：匯出的檔案最後一行沒有換行字元
- 處理：補上結尾換行，避免 diff 出現 `\ No newline at end of file`

## 部落格本身的坑

### 13. `> [!CAUTION]` 不會變成提示框

- 狀況：`[!NOTE]`、`[!TIP]` 等都正常，只有 `[!CAUTION]` 變成沒有樣式的 `<danger>` 標籤
- 原因：`remark-github-admonitions-to-directives` 把 CAUTION 轉成 `:::danger`，但主題在 `astro.config.mjs` 只註冊了 `caution`
- 處理：已在 `astro.config.mjs` 的 `rehypeComponents` 補上 `danger` 對應到 caution 樣式（2026-11-19）

### 14. 改了 Markdown 設定，建置結果卻沒變

- 狀況：修改 `astro.config.mjs` 的 remark / rehype 設定後重新建置，文章 HTML 還是舊的
- 原因：Astro 的內容快取沒有因為設定變更而失效
- 處理：清掉快取再建置

```bash
rm -rf node_modules/.astro .astro/data-store.json && pnpm build
```

### 15. 封面圖不要用 SVG

- 狀況：文章頁本來會把 frontmatter 的 `image` 當成社群分享預覽圖（OG image），而 Facebook、LINE 等平台不支援 SVG
- 注意：目前 `src/layouts/Layout.astro` 有一段 TODO 把預覽圖固定成網站橫幅，所以封面暫時不會出現在分享預覽上；之後拿掉這段時，SVG 封面就會出問題
- 處理：插圖可以用 SVG，封面另外輸出成 PNG。文章用資料夾形式（`posts/{slug}/index.md`）時，圖片放在同一個資料夾，寫 `image: ./cover.png` 即可

## 檢查指令

轉換完後在 `src/content/posts/` 下執行，快速找出常見問題：

```bash
grep -nE '^> ?$|<https?://|```jsx|notion\.com|\{[A-Z_]+\}|TODO|!\[\]' *.md
```
