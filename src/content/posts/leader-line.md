---
title: "Leader Line：輕量級 DOM 元素連接線套件"
published: 2026-11-19
description: 用 Leader Line 把兩個 DOM 元素連起來，適合流程圖、節點編輯器等畫面；整理安裝、常用選項、錨點定位與拖曳連線跟隨的實作方式。
tags: [JavaScript, 套件, SVG]
category: 前端開發
draft: false
---

## 前言

> GitHub：[leader-line-new](https://github.com/II-alex-II/leader-line-new)

Leader Line 套件可以將兩個元素連接起來，可以運用在流程圖、節點編輯器等等需要元素之間連線的畫面。

---

## 安裝方式

### 1. CDN 引入

```html
<script src="https://cdn.jsdelivr.net/npm/leader-line-new@1.1.9/leader-line.min.js"></script>
```

### 2. npm 安裝

```bash
npm install leader-line-new
```

```js
import LeaderLine from 'leader-line-new';
```

---

## 基本用法

### 最簡範例：兩個元素之間畫一條線

```html
<div id="start">起點</div>
<div id="end">終點</div>

<script>
  new LeaderLine(
    document.getElementById('start'),
    document.getElementById('end')
  );
</script>
```

只需要傳入兩個 DOM 元素，Leader Line 就會自動畫出一條帶箭頭的連線。預設樣式是從起點到終點的灰色實線 + 箭頭。

---

## 常用設定選項

建立 `LeaderLine` 時，可以透過第三個參數傳入選項物件來自訂外觀：

```js
new LeaderLine(startElement, endElement, {
  path: 'fluid',         // 連線路徑類型
  color: 'rgba(0,0,0,0.12)',  // 線條顏色
  size: 1.4,             // 線條粗細
  startPlug: 'disc',     // 起點端點樣式
  endPlug: 'disc',       // 終點端點樣式
});
```

### path — 連線路徑類型

| 值 | 說明 |
| --- | --- |
| `'straight'` | 直線（預設） |
| `'arc'` | 弧線 |
| `'fluid'` | 流線型曲線，適合節點式 UI |
| `'magnet'` | 磁吸式，會繞過障礙 |
| `'grid'` | 直角折線 |

### plug — 端點樣式

起點和終點可以分開設定不同的端點造型：

| 值 | 說明 |
| --- | --- |
| `'behind'` | 無端點，線條藏在元素後面（預設起點） |
| `'disc'` | 實心圓點 |
| `'square'` | 方形 |
| `'arrow1'` | 箭頭樣式 1（預設終點） |
| `'arrow2'` | 箭頭樣式 2 |
| `'arrow3'` | 箭頭樣式 3 |
| `'hand'` | 手指指向 |
| `'crosshair'` | 十字瞄準 |

### plug 進階設定

```js
new LeaderLine(start, end, {
  startPlug: 'disc',
  endPlug: 'disc',
  startPlugSize: 1.5,       // 起點端點大小倍率
  endPlugSize: 1.5,         // 終點端點大小倍率
  startPlugColor: 'rgba(0,0,0,0.2)',  // 起點端點顏色
  endPlugColor: 'rgba(0,0,0,0.2)',    // 終點端點顏色
  startPlugOutline: true,              // 起點端點描邊
  endPlugOutline: true,                // 終點端點描邊
  startPlugOutlineColor: 'rgba(255,255,255,0.8)',
  endPlugOutlineColor: 'rgba(255,255,255,0.8)',
  startPlugOutlineSize: 2,  // 描邊粗細倍率
  endPlugOutlineSize: 2,
});
```

---

## 連線位置更新

Leader Line 不會自動監聽 DOM 變動。當元素位置改變時（視窗縮放、拖曳、動態排版），需要手動呼叫 `position()` 來重新計算連線位置：

```js
const line = new LeaderLine(start, end);

// 單條線更新
line.position();
```

### 搭配 resize 事件

```js
const lines = [];

lines.push(new LeaderLine(startA, endA));
lines.push(new LeaderLine(startB, endB));

function refreshLines() {
  lines.forEach(line => line.position());
}

window.addEventListener('resize', refreshLines);
```

### 搭配圖片載入

如果連線的元素內含圖片，圖片載入後可能改變元素尺寸，需要在圖片載入完成後重新定位：

```js
document.querySelectorAll('img').forEach(img => {
  if (!img.complete) {
    img.addEventListener('load', refreshLines);
  }
});
```

---

## 錨點定位技巧

Leader Line 連接的是 DOM 元素的位置。如果希望連線從卡片的「特定位置」出發（例如右側中間、底部中央），可以在卡片內放置寬高為 0 的錨點元素，再透過 CSS 定位：

```html
<div class="card" id="card-a">
  <div class="lineAnchor end"></div>   <!-- 連線終點錨點 -->
  <div class="content">卡片內容</div>
  <div class="lineAnchor start"></div> <!-- 連線起點錨點 -->
</div>
```

```css
.card {
  position: absolute;
}

.lineAnchor {
  position: absolute;
  width: 0;
  height: 0;
}

/* 起點錨點放在右側中間 */
.lineAnchor.start {
  top: 50%;
  right: 0;
}

/* 終點錨點放在左側中間 */
.lineAnchor.end {
  top: 50%;
  left: 0;
}
```

```js
new LeaderLine(
  document.querySelector('#card-a .lineAnchor.start'),
  document.querySelector('#card-b .lineAnchor.end'),
  { path: 'fluid' }
);
```

這樣連線就會精確地從卡片右側連到下一張卡片的左側，而非從卡片中心出發。

---

## 實戰範例：可拖曳的節點連線

以下範例結合 Leader Line 與拖曳功能，實現一個節點式的流程畫面：

### HTML 結構

```html
<div class="contentBox">
  <div class="nodeConnect" id="card-source">
    <div class="lineAnchor end"></div>
    <div class="nodeHeader">Source Photo</div>
    <div class="Img">
      <img src="https://picsum.photos/seed/weave1/600/450" alt="source" />
    </div>
    <div class="lineAnchor start"></div>
  </div>

  <div class="nodeConnect" id="card-model">
    <div class="lineAnchor end"></div>
    <div class="nodeHeader">Stable Diffusion</div>
    <div class="Img">
      <img src="https://picsum.photos/seed/weave2/600/525" alt="model" />
    </div>
    <div class="lineAnchor start"></div>
  </div>
</div>
```

### 建立連線

```js
const lineOptions = {
  path: 'fluid',
  startPlug: 'disc',
  endPlug: 'disc',
  color: 'rgba(0, 0, 0, 0.12)',
  size: 1.4,
  startPlugColor: 'rgba(0,0,0,0.2)',
  endPlugColor: 'rgba(0,0,0,0.2)',
  startPlugSize: 1.5,
  endPlugSize: 1.5,
  startPlugOutline: true,
  endPlugOutline: true,
  startPlugOutlineColor: 'rgba(255,255,255,0.8)',
  endPlugOutlineColor: 'rgba(255,255,255,0.8)',
  startPlugOutlineSize: 2,
  endPlugOutlineSize: 2,
};

const lines = [];

lines.push(new LeaderLine(
  document.querySelector('#card-source .lineAnchor.start'),
  document.querySelector('#card-model .lineAnchor.end'),
  lineOptions
));
```

### 拖曳 + 連線跟隨

```js
document.querySelectorAll('.nodeConnect').forEach(card => {
  let isDragging = false;
  let offsetX, offsetY;

  card.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - card.offsetLeft;
    offsetY = e.clientY - card.offsetTop;
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    card.style.setProperty('--left', `${e.clientX - offsetX}px`);
    card.style.setProperty('--top', `${e.clientY - offsetY}px`);
    // 拖曳過程中即時更新所有連線位置
    lines.forEach(line => line.position());
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
});
```

重點在於 `mousemove` 事件中，每次移動都呼叫 `line.position()` 讓連線即時跟隨卡片位置。

---

## 其他實用 API

```js
const line = new LeaderLine(start, end);

// 顯示 / 隱藏
line.show();
line.hide();

// 移除連線
line.remove();

// 動態修改選項
line.color = 'red';
line.size = 3;
line.path = 'arc';

// 搭配動畫效果顯示 / 隱藏
line.show('draw');     // 繪製動畫
line.show('fade');     // 淡入
line.hide('fade');     // 淡出
```

---

## 注意事項

1. **Leader Line 使用 SVG 渲染**，它會在 `<body>` 底部插入 SVG 元素。如果你的頁面有 `overflow: hidden` 裁切，連線可能被截斷。
2. **不會自動追蹤位置變化**，任何導致元素位置改變的操作（resize、scroll、拖曳、動態內容）都需要手動呼叫 `position()`。
3. **CDN 版本建議使用 `leader-line-new`**，這是社群維護的 fork，修復了原版的多個已知問題，且持續更新。
4. **大量連線的效能**：如果頁面上有數十條以上的連線，頻繁呼叫 `position()` 可能影響效能，可考慮用 `requestAnimationFrame` 做節流。

<!--
TODO: Notion 原稿的 CodePen 連結還是佔位字串 {CODEPEN_URL}，補上實際網址後再拿掉這段註解

---

## Demo

完整的互動式範例（可拖曳節點 + 連線跟隨）已上傳至 CodePen：

👉 [**CodePen Demo**](CODEPEN_URL)
-->
