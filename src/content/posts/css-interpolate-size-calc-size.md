---
title: "CSS interpolate-size 與 calc-size() 完全指南"
published: 2026-11-19
description: 終於能對 height auto 做過渡動畫了！整理 interpolate-size 與 calc-size() 的語法、實際範例、搭配 details 元素的用法與瀏覽器支援狀況。
tags: [CSS, 動畫]
category: 前端開發
draft: false
---

## 前言

長久以來，CSS 開發者一直面臨一個痛點：**無法對 `auto`、`min-content`、`max-content`、`fit-content` 等內在尺寸（intrinsic size）進行動畫過渡**。過去我們只能靠 JavaScript 計算實際高度，或用 `max-height` hack 來模擬展開/收合效果。

CSS 新屬性 `interpolate-size` 與新函式 `calc-size()` 徹底解決了這個問題。兩者經常搭配使用——`interpolate-size` 負責開啟插值能力，`calc-size()` 則讓你對內在尺寸進行數學運算。

---

## 什麼是 `interpolate-size`？

`interpolate-size` 是一個 CSS 屬性，用來**啟用內在尺寸關鍵字的插值（interpolation）能力**，讓瀏覽器知道可以在固定長度與 `auto` 等關鍵字之間進行平滑過渡。

### 語法

```css
interpolate-size: allow-keywords | numeric-only;
```

| 值 | 說明 |
| --- | --- |
| `numeric-only` | **預設值**。只允許數值之間的插值，`auto` 等關鍵字無法參與動畫（傳統行為）。 |
| `allow-keywords` | 允許內在尺寸關鍵字（`auto`、`min-content`、`max-content`、`fit-content`）參與插值動畫。 |

---

## 為什麼需要它？

### 過去的痛點

```css
/* ❌ 這段程式碼的 height 過渡不會有動畫效果 */
.panel {
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease;
}

.panel.open {
  height: auto; /* auto 無法被插值，過渡直接跳變 */
}
```

### 傳統解法（hack）

```css
/* 😐 max-height hack：需要猜一個夠大的值 */
.panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
}

.panel.open {
  max-height: 1000px; /* 猜測值，動畫時間不精確 */
}
```

這種方式問題很多：

- 需要預估最大高度
- 動畫時間與實際內容不成比例
- 收合動畫會有明顯延遲

---

## 基本使用

### 全域啟用（推薦）

最簡單的方式是在 `:root` 上設定，讓整個頁面都支援：

```css
:root {
  interpolate-size: allow-keywords;
}
```

> [!NOTE]
> `interpolate-size` 是**可繼承的**，所以設在 `:root` 上，所有子元素都會生效。

### 局部啟用

也可以只在特定容器上啟用：

```css
.accordion {
  interpolate-size: allow-keywords;
}
```

---

## 實際範例

### 範例一：手風琴展開/收合

```html
<div class="accordion">
  <button class="accordion-toggle" onclick="this.nextElementSibling.classList.toggle('open')">
    點擊展開
  </button>
  <div class="accordion-content">
    <p>這裡是可展開的內容，高度會平滑過渡到 auto。</p>
  </div>
</div>
```

```css
:root {
  interpolate-size: allow-keywords;
}

.accordion-content {
  height: 0;
  overflow: hidden;
  transition: height 0.35s ease;
}

.accordion-content.open {
  height: auto;
}
```

完全不需要 JavaScript 計算高度，也不需要 `max-height` hack。

---

### 範例二：寬度自適應動畫

```css
:root {
  interpolate-size: allow-keywords;
}

.tag {
  display: inline-block;
  width: min-content;
  overflow: hidden;
  white-space: nowrap;
  transition: width 0.3s ease;
}

.tag:hover {
  width: max-content;
}
```

---

### 範例三：搭配 CSS `@keyframes` 動畫

```css
:root {
  interpolate-size: allow-keywords;
}

.reveal {
  animation: reveal 0.5s ease forwards;
}

@keyframes reveal {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: auto;
    opacity: 1;
  }
}
```

---

## 深入 `calc-size()` 函式

### 為什麼需要 `calc-size()`？

傳統的 `calc()` 無法接受 `auto`、`min-content` 等內在尺寸關鍵字作為運算元：

```css
/* ❌ 這是無效的 */
width: calc(auto + 20px);
height: calc(min-content * 0.8);
```

`calc-size()` 就是為了解決這個限制而生的函式，讓你能**對內在尺寸進行數學運算**。

### 語法

```css
calc-size(<basis>, <calculation>)
```

| 參數 | 說明 |
| --- | --- |
| `<basis>` | 基礎尺寸值。可以是 `auto`、`min-content`、`max-content`、`fit-content`、`stretch`，或是另一個 `calc-size()` 表達式。也可以是具體的長度值如 `100px`。 |
| `<calculation>` | 數學運算式。使用特殊關鍵字 **`size`** 來引用 `<basis>` 的計算結果，然後進行加減乘除運算。 |

### 基本範例

```css
/* size 代表 basis 的計算結果 */
height: calc-size(auto, size);            /* 等同於 auto */
height: calc-size(auto, size * 0.5);      /* auto 高度的一半 */
height: calc-size(auto, size - 20px);     /* auto 高度減去 20px */
height: calc-size(auto, size + 2rem);     /* auto 高度加上 2rem */

width: calc-size(min-content, size);       /* 等同於 min-content */
width: calc-size(max-content, size * 0.8); /* max-content 的 80% */
width: calc-size(fit-content, size + 4rem);/* fit-content 再加 4rem */
```

### `calc-size()` vs `calc()` 差異比較

| 特性 | `calc()` | `calc-size()` |
| --- | --- | --- |
| 數值間運算 | ✅ `calc(100px + 2rem)` | ✅ `calc-size(100px, size + 2rem)` |
| 對 `auto` 運算 | ❌ | ✅ `calc-size(auto, size * 0.5)` |
| 對 `min-content` 運算 | ❌ | ✅ `calc-size(min-content, size + 10px)` |
| 巢狀運算 | ✅ | ✅ 可巢狀 `calc()` 於 calculation 中 |
| 可用於動畫插值 | 僅數值 | 可搭配 `interpolate-size` 動畫 |

### 實用範例

#### 側邊欄展開動畫

```css
:root {
  interpolate-size: allow-keywords;
}

.sidebar {
  width: 60px;
  overflow: hidden;
  transition: width 0.4s ease;
}

.sidebar.expanded {
  width: calc-size(fit-content, size + 2rem);
  /* fit-content 的寬度再加上 2rem 的呼吸空間 */
}
```

#### 限制最大高度為內容的一半

```css
.preview {
  height: calc-size(auto, size * 0.5);
  overflow: hidden;
}
```

#### 留出固定空間給 header/footer

```css
.main-content {
  height: calc-size(auto, size - 80px);
  /* 內容高度扣掉 header 的 80px */
}
```

#### 搭配 `@keyframes` 動畫

```css
:root {
  interpolate-size: allow-keywords;
}

@keyframes grow-in {
  from {
    height: 0;
  }
  to {
    height: calc-size(auto, size + 1rem);
    /* 最終高度 = auto + 1rem 的額外空間 */
  }
}

.card {
  animation: grow-in 0.4s ease forwards;
  overflow: hidden;
}
```

#### 響應式百分比縮放

```css
.container {
  /* 在小螢幕上只顯示 auto 高度的 70% */
  height: calc-size(auto, size * 0.7);
}

@media (min-width: 768px) {
  .container {
    height: calc-size(auto, size); /* 完整高度 */
  }
}
```

### `calc-size()` 中使用 `calc()`

`<calculation>` 部分可以包含 `calc()` 等其他數學函式：

```css
width: calc-size(auto, size - calc(2rem + 10px));
height: calc-size(fit-content, size * calc(1 / 3));
width: calc-size(max-content, max(size, 200px));
width: calc-size(auto, clamp(100px, size, 500px));
```

### 何時使用 `calc-size()`？何時只用 `interpolate-size`？

| 場景 | 使用方式 |
| --- | --- |
| 單純從 `0` 過渡到 `auto` | 只需 `interpolate-size: allow-keywords` |
| 從 `min-content` 過渡到 `max-content` | 只需 `interpolate-size: allow-keywords` |
| 需要 `auto` 的一半高度 | `calc-size(auto, size * 0.5)` |
| 需要 `fit-content` 加上額外間距 | `calc-size(fit-content, size + 2rem)` |
| 需要限制 auto 不超過某值 | `calc-size(auto, min(size, 500px))` |

> [!TIP]
> **簡單記法**：如果目標就是內在尺寸本身，只要 `interpolate-size` 即可；如果需要對內在尺寸「加工」，就用 `calc-size()`。

### `calc-size()` 的瀏覽器支援

| 瀏覽器 | 版本 |
| --- | --- |
| Chrome | 129+ ✅ |
| Edge | 129+ ✅ |
| Firefox | 136+ ✅ |
| Safari | 18.4+ ⚠️ |

### 注意事項

1. **`size` 關鍵字只能在 `calc-size()` 內使用**，不能在 `calc()` 中使用。
2. **`calc-size()` 的結果不能再作為 `calc()` 的運算元**，但可以作為另一個 `calc-size()` 的 basis。
3. **不需要 `interpolate-size` 也能使用 `calc-size()` 做靜態尺寸設定**，但如果要做動畫過渡，兩者需要搭配。

---

## 搭配 `<details>` 元素

`interpolate-size` 對原生 `<details>` / `<summary>` 元素的展開收合也能生效：

```css
:root {
  interpolate-size: allow-keywords;
}

details {
  overflow: hidden;
  transition: height 0.3s ease;
}

details:not([open]) {
  height: calc-size(auto, size); /* summary 的高度 */
}

details[open] {
  height: auto;
}
```

> [!WARNING]
> `<details>` 的動畫支援可能還需要搭配 `::details-content` 偽元素（部分瀏覽器支援中）。

---

## 注意事項

### 1. 需要搭配 `overflow: hidden`

當元素從 `height: 0` 過渡到 `height: auto` 時，通常需要設定 `overflow: hidden` 或 `overflow: clip`，否則內容會直接溢出可見。

### 2. 繼承性

`interpolate-size` 是**可繼承的屬性**，設在父層就能讓所有子元素生效。建議直接設在 `:root` 上。

### 3. 不影響最終佈局

`interpolate-size` 只影響**動畫/過渡的插值行為**，不會改變元素的最終尺寸計算結果。

### 4. 只影響內在尺寸關鍵字

只有以下關鍵字受到影響：

- `auto`
- `min-content`
- `max-content`
- `fit-content`
- `stretch`（部分瀏覽器）
- `contain`（部分瀏覽器）

普通數值之間的過渡本來就可以運作，不受此屬性影響。

---

## 瀏覽器支援

| 瀏覽器 | 版本 |
| --- | --- |
| Chrome | 129+ ✅ |
| Edge | 129+ ✅ |
| Firefox | 136+ ✅ |
| Safari | 17.4+ ⚠️（部分支援） |

> [!NOTE]
> 截至 2025 年中，主流瀏覽器已廣泛支援。可透過 [Can I Use](https://caniuse.com/mdn-css_properties_interpolate-size) 查看最新狀態。

### 漸進增強策略

```css
/* 不支援的瀏覽器會忽略此屬性，退回原本的跳變行為 */
:root {
  interpolate-size: allow-keywords;
}

/* 功能偵測 */
@supports (interpolate-size: allow-keywords) {
  .panel {
    transition: height 0.3s ease;
  }
}
```

由於不支援的瀏覽器會直接忽略此屬性，元素的功能不受影響，只是沒有過渡動畫，屬於**天然的漸進增強**。

---

## 與舊方案的比較

| 方案 | 優點 | 缺點 |
| --- | --- | --- |
| `max-height` hack | 相容性好 | 動畫時間不精確、需猜測值 |
| JavaScript 計算 | 精確 | 需要監聽內容變化、效能開銷 |
| `interpolate-size` | 原生、精確、零 JS | 較新瀏覽器才支援 |

---

## 總結

`interpolate-size` 與 `calc-size()` 是 CSS 動畫與佈局領域的重大突破：

**`interpolate-size: allow-keywords`**

- 一行 CSS 即可讓 `height: auto` 參與過渡動畫
- 可繼承，設在 `:root` 全域生效
- 天然漸進增強，不影響不支援的瀏覽器

**`calc-size()`**

- 突破 `calc()` 無法對內在尺寸運算的限制
- 透過 `size` 關鍵字引用基礎值，靈活進行加減乘除
- 搭配 `interpolate-size` 可實現精細的尺寸動畫

建議在新專案中直接加入：

```css
:root {
  interpolate-size: allow-keywords;
}
```

從此告別 `max-height` hack！
