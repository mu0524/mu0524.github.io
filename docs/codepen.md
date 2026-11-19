# 文章內嵌 CodePen 範例

文章裡用 `:::codepen` 容器包住程式碼區塊，建置時會轉成 CodePen 的 [Prefill Embed](https://blog.codepen.io/documentation/prefill-embeds/)，讀者可以直接操作結果。不需要先在 CodePen 建立 Pen，也不需要登入。

實作在 `src/plugins/remark-codepen.mjs`，樣式在 `src/styles/markdown-extend.scss` 的 `.codepen-embed`。

## 寫法

````markdown
:::codepen{title="範例標題" height="400" tab="result" scripts="https://cdn.jsdelivr.net/npm/xxx.js"}
```html
<button id="btn">按我</button>
```
```css
button { color: red; }
```
```js
document.getElementById("btn").addEventListener("click", () => alert("hi"));
```
:::
````

| 屬性 | 說明 | 預設 |
| --- | --- | --- |
| `title` | Pen 標題，按「Edit on CodePen」開出去時會用到 | `Demo` |
| `height` | 嵌入框高度（px） | `400` |
| `tab` | 預設顯示的分頁，例：`result`、`css,result` | `result` |
| `scripts` | 外部 JS 網址，多個用逗號分隔 | 無 |
| `stylesheets` | 外部 CSS 網址，多個用逗號分隔 | 無 |

- 支援的語言標記：`html`、`css`、`scss`、`js`（`javascript`）、`ts`（`typescript`），其他語言的程式碼區塊會被忽略
- CodePen 主題會跟著網站目前的深淺色（`dark` / `light`）
- 同一頁可以放多個，換頁（swup）回來也會重新載入

## 注意事項

- CodePen 會擋無頭瀏覽器（headless），用 Playwright 截圖驗證時嵌入框會是空白或 403。要驗證範例程式本身，把程式碼抽出來做成本機 HTML 測試比較快
- 短時間內反覆載入很多次，CodePen 可能會暫時回傳空白畫面，一般讀者不會遇到
- 不支援 CodePen 的環境（RSS、腳本被擋）會直接顯示原始程式碼
