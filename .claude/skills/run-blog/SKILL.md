---
name: run-blog
description: 在本機 Windows 啟動這個 Astro 部落格的 dev server，並用 Playwright 實際打開頁面、操作、截圖，確認改動有沒有問題。觸發詞：run-blog、跑起來、本機執行、啟動部落格、dev server、看看改的有沒有問題、預覽網站。
---

# run-blog：在本機跑部落格並實際檢查畫面

Astro 7 + swup，套件用 pnpm 管理，Node 版本看 `.nvmrc`（22）。

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

## 3. 啟動 dev server（背景執行）

先確認 4321 port 沒被舊的 dev server 佔住，再用 PowerShell 搭配 `run_in_background: true` 啟動，輸出寫到 scratchpad：

```powershell
Get-NetTCPConnection -LocalPort 4321 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -Confirm:$false }
pnpm dev *> "<scratchpad>\dev.log"
```

等到 log 裡出現 `localhost:4321` 再往下做（大約 3～15 秒）：

```bash
until grep -qaE "localhost:[0-9]+|\[ERROR\]" "<scratchpad>/dev.log"; do sleep 0.5; done; tail -15 "<scratchpad>/dev.log"
```

- log 開頭的 `NativeCommandError` 不是錯誤，是 PowerShell 把 pnpm 的 stderr 包起來的寫法
- 網址是 `http://localhost:4321/`，文章頁是 `/posts/<資料夾名稱>/`

## 4. 安裝 Playwright（不放進專案）

專案沒有 Playwright 依賴，裝在使用者快取資料夾，之後各次 session 共用。已經裝過就跳過：

```bash
export PATH="/c/Program Files/nodejs:$PATH"
PW_DIR="$LOCALAPPDATA/run-blog-pw"
if [ ! -d "$PW_DIR/node_modules/playwright" ]; then
  mkdir -p "$PW_DIR" && cd "$PW_DIR" && echo '{"name":"run-blog-pw","private":true}' > package.json
  npm i playwright --silent && npx playwright install chromium
fi
```

## 5. 實際操作頁面

```bash
export PATH="/c/Program Files/nodejs:$PATH"
PW_DIR="$LOCALAPPDATA/run-blog-pw" node .claude/skills/run-blog/smoke.mjs "<scratchpad>"
```

`smoke.mjs` 做的事：
1. 首頁、彙整、關於我、RSS、robots、每篇文章都檢查 HTTP 200，不存在的網址要回 404
2. 首頁、彙整、關於我、404、文章頁、文章目錄、手機版截圖
3. 文章頁：目錄項目數、上一篇／下一篇按鈕，點擊後換頁
4. 從首頁點文章、再點彙整，走 swup 換頁，確認頁尾分類樹的展開狀態和 current 標記
5. swup 換頁後點一次深色切換，確認只切換一次（之前發生過重複綁定事件、點一次切兩次）
6. 頁尾收合鈕、搜尋面板能打開、手機寬度 375px 沒有水平溢出
7. 列出頁面上的 JS 錯誤（包含發生的網址和 stack）

截圖存在 `<scratchpad>`，**每一張都要用 Read 打開來看**，空白畫面就是失敗。
檢查重點如果是別的區塊，直接改 `smoke.mjs`，或在 scratchpad 另外寫一支腳本，用同樣的 `createRequire(join(PW_DIR, "package.json"))` 寫法載入 playwright。

## 已知、跟改動無關的訊息

| 訊息 | 原因 |
|------|------|
| CodePen 403、`Refused to display 'https://codepen.io/' in a frame`，文章中出現大段空白 | CodePen 擋掉自動化瀏覽器，用一般瀏覽器開正常（smoke.mjs 已過濾） |
| `/pagefind/pagefind.js`、`/sitemap-index.xml` 回 404，搜尋沒有結果 | 這兩個只有 `pnpm build` 才會產生，dev 模式沒有 |
| 1440px 截圖看不到文章目錄 | `Toc.astro` 設定 1535px 以下隱藏，smoke.mjs 用 1920px 截圖 |
| Astro 有新版本可更新的 warn | 版本提示，不影響 |

## 疑難排解

**切換分支後出現 `LocalImageUsedWrongly`（`Received ./cover.png`）**：dev server 開著時切到 content schema 不同的分支，內容快取用舊 schema 重建，封面被存成字串。停掉 dev server、刪掉 `.astro/` 快取（有 gitignore，會自動重新產生）再重啟：

```powershell
Remove-Item -Recurse -Force .astro; pnpm dev
```

要確認正式打包沒問題時跑 `pnpm build`（`dist/` 有 gitignore）。

## 結束

dev server 要保留給使用者自己看，除非使用者要求，否則不要停掉。回報時附上網址 `http://localhost:4321/`。
