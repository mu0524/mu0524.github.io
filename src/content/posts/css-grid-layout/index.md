---
title: "用了 grid 之後，我對 flex 有點愧疚"
published: 2026-11-23
description: "一直以為 flex 就夠用了，直到開始用 grid 切版。卡片自動排、版面直接畫、fr 取代 calc，順便少包好幾層 div，整理我用 grid 之後最有感的四件事。"
tags: [CSS, Grid, RWD]
category: 前端開發
subcategory: CSS
draft: true
---

## 🔍 前言

我是那種看到設計稿，腦中會先跑出 `display: flex` 的人

三欄卡片？flex。  
左右兩欄？flex。  
置中？當然也是 flex

用久了也不覺得哪裡不對，頂多就是 `calc()` 多寫幾個、外層多包幾個 div、media query 多開幾段而已嘛 🙂

直到最近開始試著用 grid 切版，才發現原來這些「而已」，全部都可以不用做 😶

---

## 🧱 以前的我：用 flex 硬切三欄

先來看看以前的我怎麼切一排三張卡片：

```css
.cardList {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.cardItem {
  width: calc((100% - 60px) / 3); /* 扣掉兩個 gap 再除 3 */
}

@media (max-width: 1180px) {
  .cardItem {
    width: calc((100% - 30px) / 2); /* 改兩欄，重算一次 */
  }
}

@media (max-width: 768px) {
  .cardItem {
    width: 100%;
  }
}
```

能動，但每換一次欄數就要重新按一次計算機，gap 改了還要回頭把每個 `calc()` 都改一遍

那時候的我覺得：切版本來就是這樣啊

---

## ✨ grid 讓我驚呆的四件事

### 1. 卡片自己排

同樣一排卡片，grid 只要這樣：

```css
.cardList {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 30px;
}
```

沒了，真的就這樣

意思是「每張卡片至少 240px，塞得下幾張就放幾張，剩下的空間平均分」。  
螢幕變窄，一排放不下就自動換成兩張、一張，**一個 media query 都不用寫**

剛才那三段 media query，頓時有點失業 🫠

> [!TIP]
> 容器比 240px 還窄時，卡片會撐破容器。  
> 改寫成 `minmax(min(240px, 100%), 1fr)` 就能避免

`auto-fit` 還有一個雙胞胎 `auto-fill`，差別在卡片數量不夠排滿一列的時候：

| 寫法 | 卡片不夠時 |
| --- | --- |
| `auto-fit` | 把空的欄位收起來，卡片撐滿整列 |
| `auto-fill` | 保留空的欄位，卡片維持原本寬度 |

<!-- TODO：補一個 CodePen，拖拉容器寬度看 auto-fit 和 auto-fill 的差別 -->

 

### 2. 版面用畫的

以前要做「上面 header、左邊側欄、右邊內容、下面 footer」的版面，我會先在腦中拆成好幾層 flex

用 grid 的 `grid-template-areas`，可以直接把版面「畫」出來：

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas:
    "header header"
    "side   main"
    "footer footer";
}

.header { grid-area: header; }
.side   { grid-area: side; }
.main   { grid-area: main; }
.footer { grid-area: footer; }
```

寫 CSS 的時候，版面長什麼樣子一眼就看得出來

最爽的是 RWD：手機版要把側欄移到內容下面，**只要重畫一次，HTML 一行都不用動**

```css
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "side"
      "footer";
  }
}
```

> [!NOTE]
> 同一個名字佔的格子要排成長方形，L 形或分開的區塊會讓整段 `grid-template-areas` 失效。  
> 想留空的格子可以寫 `.`

<!-- TODO：補一張示意圖，桌機和手機版的區塊配置對照 -->

 

### 3. 不用再按計算機

grid 有一個專屬單位 `fr`，意思是「剩下空間的幾份」

```css
.cardList {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 也可以寫 repeat(3, 1fr) */
  gap: 30px;
}
```

`fr` 是在扣掉 gap 和固定寬度 **之後** 才分配，所以 gap 從 30px 改成 40px，什麼都不用重算

跟 `calc((100% - 60px) / 3)` 正式說掰掰 👋

固定寬度和 `fr` 也可以混著用：

```css
grid-template-columns: 240px 1fr 2fr; /* 第一欄固定，剩下的分成 1：2 */
```

> [!TIP]
> `1fr` 的最小值其實是內容寬度，裡面放了很長的網址或圖片，欄位還是會被撐開。  
> 遇到這種情況改寫成 `minmax(0, 1fr)`

 

### 4. 少包好幾層 div

flex 一次只能管一個方向，要排出「有的橫跨兩欄、有的佔兩列」的版面，就得一層一層往外包

grid 是 **行跟列一起排**，子元素直接告訴它要佔幾格就好：

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.gallery .featured {
  grid-column: span 2; /* 橫跨兩欄 */
  grid-row: span 2;    /* 佔兩列 */
}
```

HTML 只要一層，不用再為了對齊多包一個 `.row`、再包一個 `.col`

<!-- TODO：補一個 CodePen，展示不規則格狀排列 -->

---

## 🤝 但 flex 還是很好用

用了 grid 之後，我並沒有把 flex 丟掉（flex 抱歉，剛剛講得有點過分）

兩個擅長的事情不一樣：

| | flex | grid |
| --- | --- | --- |
| 方向 | 一次排一個方向 | 行和列一起排 |
| 適合 | 按鈕列、選單、標籤、單排置中 | 卡片列表、整頁版面、不規則格狀 |
| 尺寸由誰決定 | 內容決定自己多寬 | 版面先決定格子，內容放進去 |

我現在的習慣是：**大的版面用 grid，裡面的小元件用 flex**

---

## 🏆 結論

- 🃏 `repeat(auto-fit, minmax())`：卡片自己決定一排放幾張，省掉一堆 media query
- 🗺️ `grid-template-areas`：版面直接畫出來，RWD 只要重畫，不用動 HTML
- 🧮 `fr`：自動扣掉 gap 再分配，不用再算 `calc()`
- 📦 `grid-column` / `grid-row`：行列一起排，HTML 少包好幾層

現在看到設計稿，腦中先跑出來的已經悄悄換成 `display: grid` 了 ✨

---

## 📚 參考連結

- [CSS Grid Layout｜MDN](https://developer.mozilla.org/zh-TW/docs/Web/CSS/CSS_grid_layout)
- [A Complete Guide to CSS Grid｜CSS-Tricks](https://css-tricks.com/snippets/css/complete-guide-grid/)
