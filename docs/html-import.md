# HTML 文章轉成部落格文章的注意事項

從 CMS 後台編輯器（CKEditor 之類）複製出來的 HTML，不能直接貼進 `src/content/posts/`。以下是轉換 `laravel-project-check-agent`、`elevatezoom-plus` 時踩到的問題與處理方式。

Notion 匯出的坑另見 `docs/notion-import.md`，frontmatter、封面等共通規則以那份為準。

## 轉換流程速查

1. 建立資料夾 `src/content/posts/{slug}/index.md`，補 frontmatter。同一天已經有其他文章時，`published` 要加上時間，新文章才會排第一（見 `docs/notion-import.md` 第 16 點）
2. 標籤逐一換成 Markdown，照下方清單處理換行、實體字元、表格
3. `pnpm build`，打開 `dist/posts/{slug}/index.html` 或 http://fanggg.test/ 實際看過

## 坑與處理方式

### 1. 標題裡夾著 `<br />` 和行內字級

- 狀況：編輯器產出的標題長這樣：`<h2><br /><span style="font-size:22px;">如何啟動</span></h2>`，`<br />` 是作者想在標題前多空一行
- 處理：只留文字。段落間距交給網站樣式，`style="font-size"` 一律丟掉。標題前面照部落格慣例加 emoji，區塊之間用 `---` 分隔

### 2. 段落內的 `<br />` 不能只換成一個換行

- 狀況：`<p>第一句<br />第二句</p>` 如果改成兩行文字中間只有一個換行，Markdown 會把它們合成同一段，而且中文之間會多出一個空白
- 處理：拆成兩個段落（中間空一行）。部落格本來就是一句一段的寫法

### 3. 只有 `&nbsp;` 的空段落

- 狀況：`<p>...<br />&nbsp;</p>`，作者用來撐出空白
- 處理：直接刪掉

### 4. HTML 實體字元要先轉回原本的符號

- 狀況：`<code>&lt;h1&gt;</code>`、`$row-&gt;data`、`&rarr;` 這類實體字元，放進 Markdown 的行內程式碼或程式碼區塊後 **不會被解碼**，畫面會直接顯示 `&lt;h1&gt;`
- 處理：轉成 `<h1>`、`->`、`→` 再放進反引號。轉完全文搜尋 `&[a-z]+;` 確認沒有漏掉

### 5. 表格儲存格裡有 `<br />`

- 狀況：Markdown 表格一列只能一行，儲存格內的換行（例如流程表「會 → … `<br />` 不會 → …」）沒辦法直接寫
- 處理：表格本身是「步驟＋說明」這種一欄說明的結構時，改寫成有序清單、分支用巢狀清單，比在儲存格塞 `<br>` 好讀

### 6. `<pre><code>` 沒有語言

- 狀況：編輯器的程式碼區塊不帶語言，轉過來不會上色
- 處理：自己補語言標記。Blade 範本用 ` ```blade `（Expressive Code 支援，會正確標出 `{{-- --}}` 和 `{!! !!}`）

### 7. 程式碼裡的 `->` 顯示成箭頭

- 狀況：程式碼字型 JetBrains Mono 有連字（ligature），`$row->data` 在畫面上會顯示成 `$row→data`
- 原因：只是字型的顯示效果，HTML 與複製下來的文字仍是 `->`
- 處理：目前維持現狀。若要關掉，在程式碼區塊樣式加 `font-variant-ligatures: none`

### 8. 句尾的「。」

- 狀況：原文每句結尾有「。」，部落格其他文章的段落與清單結尾都不加
- 處理：拆成一句一段後，刪掉段落與清單最後的「。」；句子中間的「。」保留

以下是轉換 `elevatezoom-plus` 時遇到的：

### 9. 手寫的目錄與按鈕連結

- 狀況：原文開頭有 `<ul id="toc">` 手寫目錄；官方網站連結用 `style="background:#bb1b21;..."` 做成紅色按鈕
- 處理：目錄刪掉，文章頁會自動產生。按鈕改成一般的 Markdown 連結清單，部落格不用行內樣式

### 10. 用顏色標示的值

- 狀況：參數表的預設值用 `<span style="background-color:#eee;color:#ff4646;">&nbsp;false&nbsp;</span>` 做成灰底紅字
- 處理：改成行內程式碼 `` `false` ``，前後的 `&nbsp;` 一起拿掉。參數名稱也一起包成行內程式碼

### 11. 參數表的預設值跟套件實際不一致

- 狀況：原文的參數表是從舊版 elevateZoom 的文件整理的，對照 ez-plus 1.2.1 原始碼後：
  - 不存在的參數：`easingType`、`easingDuration`（ez-plus 改用 `easingAmount`）
  - 名稱不同：`zoomLens` 應為 `showLens`、`lensBorder` 應為 `lensBorderSize`
  - 預設值不同：`responsive` 是 `true`、各種 FadeIn／FadeOut 是 `false`、`tintOpacity` 是 `0.4`、`cursor` 是 `inherit` 等
- 處理：套件文章的參數表，從 npm 抓原始碼核對預設值，並在表格下方註明依據的版本

```bash
curl -sL https://cdn.jsdelivr.net/npm/ez-plus/src/jquery.ez-plus.js | grep -n "fn.ezPlus.options" -A80
```

### 12. 程式碼區塊的語言標錯

- 狀況：`<script src="..."></script>` 這種 HTML 被標成 `language-javascript`；標成 `language-css` 的區塊，內文卻說是「SCSS 補上」
- 處理：依程式碼內容重新標語言，不要照抄 class

### 13. 外部圖片、程式碼截圖、表格裡的圖片

- 狀況：圖片都是外連；其中一張是程式碼的截圖；另一張（16 個位置的示意圖）塞在表格儲存格裡，而且是官方的橘色圖，只有 150px
- 處理：
  - 程式碼截圖改成真的程式碼區塊，用 Expressive Code 的 `ins={行號}` 標出新增的那行，讀者才能複製（工作專案的程式碼則依第 15 點處理）
  - 表格裡的圖移到表格下方，前面加一句說明
  - 不符合部落格風格的示意圖，照 CLAUDE.md 第十一節用 SVG 重畫再輸出 PNG
  - 其他要保留的外部圖片下載到文章資料夾，不要外連

### 14. 簡單的示意圖輸出太大

- 狀況：照 CLAUDE.md 用 2 倍（density 144）輸出 480 寬的 SVG，得到 960px 的 PNG，文章會撐滿整個內文寬度，一張簡單的圖佔掉一整個螢幕
- 處理：圖片會以原始寬度顯示（最多到內文寬度），內容簡單的圖輸出 600～640px 寬就好

### 15. 工作上的內容不能公開

- 狀況：原文是寫給同事看的筆記，裡面有公司內部的 DEMO 網址、公司 CMS 的檔案路徑與程式碼、公司圖庫的圖片網址。部落格是公開的 GitHub Pages，這些都不能放上來
- 處理：
  - 「實際使用」這類工作範例整段拿掉，改寫成通用的示範，用 `:::codepen` 做成可以操作的範例（寫法見 `docs/codepen.md`）
  - 範例圖片用 [Lorem Picsum](https://picsum.photos/) 的固定 ID，例如 `https://picsum.photos/id/250/400/400`，同一個 ID 換尺寸就是同一張照片，剛好可以當原圖和放大用的大圖
  - 轉換前先掃一次原文的網址與路徑，看到公司網域、內部系統路徑就先問使用者
  - `docs/` 也會公開，記錄坑的時候同樣不要寫公司網域、路徑

### 16. 套件範例要先在本機跑過

- 狀況：CodePen 會擋無頭瀏覽器，沒辦法直接驗證嵌入的範例
- 處理：把範例的 HTML、CSS、JS 組成一個本機 HTML（外部套件用同樣的 CDN 網址），用 Playwright 開起來實際操作、看 console 有沒有錯誤，確定能動再放進文章。照文章的說法實測，常常會發現原文的說明跟套件實際行為不一樣（例如 ez-plus 其實會把 click 轉給圖片）

## 檢查指令

轉換完後在文章資料夾執行，找出漏掉的 HTML 標籤、實體字元與外連圖片：

```bash
grep -nE '&[a-z]+;|<br ?/?>|<span|<p>|style=|<img|!\[[^]]*\]\(https?://' index.md
```

程式碼區塊裡本來就有的 `<img>`、`style=` 會一起被找出來，這些不用改。
