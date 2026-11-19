---
name: run-blog
description: 在本機 Windows 啟動這個 Astro 部落格的 dev server，並用 Playwright 實際打開頁面、操作、截圖，確認改動有沒有問題。觸發詞：run-blog、跑起來、本機執行、啟動部落格、dev server、看看改的有沒有問題、預覽網站。
---

# run-blog：在本機跑部落格並實際檢查畫面

Astro 7 + Svelte + swup，套件用 pnpm 管理，Node 版本看 `.nvmrc`（22）。

## 1. 確認環境

這台電腦的 Node 是用 winget 裝在 `C:\Program Files\nodejs`，pnpm 是用 `npm i -g` 裝在 `%APPDATA%\npm`。
如果是在安裝前就開著的 shell，PATH 會抓不到，每個 PowerShell 指令最前面都要補上這行：

```powershell
$env:Path = "C:\Program Files\nodejs;$env:APPDATA\npm;" + $env:Path
```

`node -v`、`pnpm -v` 都有版本號才往下做。都沒有的話：

```powershell
winget install --id OpenJS.NodeJS.22 -e --accept-source-agreements --accept-package-agreements --silent
npm i -g pnpm@10
```

- `corepack enable` 要系統管理員權限，會出現 EPERM，不要用
- 裝 pnpm 10 就可以，`.npmrc` 有開 `manage-package-manager-versions`，執行時會自動切到 `package.json` 裡 `packageManager` 指定的版本

## 2. 安裝套件

沒有 `node_modules` 或 `pnpm-lock.yaml` 有變動時才需要跑：

```powershell
pnpm install
```

postinstall 會一起下載 Playwright Chromium，第一次大約要 2～3 分鐘，timeout 設 600000。

## 3. 啟動 dev server（背景執行）

用 PowerShell 搭配 `run_in_background: true` 啟動，輸出寫到 scratchpad：

```powershell
pnpm dev *> "<scratchpad>\dev.log"
```

等到 log 裡出現 `localhost:4321` 再往下做（大約 15 秒）：

```bash
until grep -qaE "localhost:[0-9]+|\[ERROR\]" "<scratchpad>/dev.log"; do sleep 0.5; done; tail -15 "<scratchpad>/dev.log"
```

- log 開頭的 `NativeCommandError` 不是錯誤，是 PowerShell 把 pnpm 的 stderr 包起來的寫法
- 網址是 `http://localhost:4321/`，文章頁是 `/posts/<資料夾名稱>/`（`/posts/` 本身是 404，正常）

## 4. 實際操作頁面

```powershell
node .claude/skills/run-blog/smoke.mjs "<scratchpad>"
```

`smoke.mjs` 做的事：
1. 首頁、彙整頁、每篇文章都檢查 HTTP 200
2. 首頁、第一篇文章頁、手機寬度 375px 文章頁截圖
3. 從首頁點文章連結，走 swup 換頁，確認換頁後頁尾分類樹的展開狀態和 current 標記
4. 印出頁尾分類樹在每個步驟的狀態，以及頁面上的 JS 錯誤（包含發生的網址和 stack）

截圖存在 `<scratchpad>`，**每一張都要用 Read 打開來看**，空白畫面就是失敗。
檢查重點如果是別的區塊，直接改 `smoke.mjs` 或在 scratchpad 另外寫一支腳本，用同樣的 `createRequire` 寫法載入 playwright。

## 已知、跟改動無關的訊息

| 訊息 | 原因 |
|------|------|
| CodePen 403、`Refused to display 'https://codepen.io/' in a frame` | CodePen 擋掉自動化瀏覽器，用一般瀏覽器開正常（smoke.mjs 已過濾） |
| swup 換頁時 `Cannot read properties of undefined (reading 'body')` | `@astrojs/partytown` 內建的 `astro:before-swap` 處理器讀取 `e.newDocument.body`，但 swup 觸發的事件沒有 `newDocument`，是兩個套件之間的相容問題 |

## 結束

dev server 要保留給使用者自己看，除非使用者要求，否則不要停掉。回報時附上網址 `http://localhost:4321/`。
