---
title: "為什麼漸層色總是髒髒的？LCH vs. RGB"
published: 2026-11-19
description: 漸層動畫的顏色總是混濁、過渡不順？原因出在 RGB 色彩模式，改用更符合人眼感知的 LCH 就能讓漸層乾淨又自然。
tags: [CSS, 色彩, 漸層, Figma]
category: 前端開發
draft: false
---

## 🔍 前言

當想要使用漸層做動畫時，會發現顏色總是「髒髒的」、過渡不順，甚至變得混濁

其實是因為一般使用的 RGB 色彩模式 不是最適合的選擇

想讓漸層更自然、色彩更乾淨？改成 LCH 色彩模式，便可以解決這個問題

## 🎨 LCH 色彩是什麼？跟 RGB 有什麼不同？

### LCH（Lightness, Chroma, Hue）

是一種更符合人眼感知的色彩表示法，基於 CIELAB 色彩空間

- L（Lightness 亮度）決定顏色的明暗程度，0 是黑，100 是白
- C（Chroma 彩度）影響顏色的鮮豔程度，數值越高，顏色越飽和
- H（Hue 色相）用角度（0°-360°）表示顏色，像 0° 是紅色，120° 是綠色，240° 是藍色

### RGB（Red, Green, Blue）

是一種基於光線混合的色彩模式，透過紅、綠、藍三種基色的組合，混合出各種顏色

- R（Red 紅色）控制紅色的強度，數值範圍從 0（無紅色）到 255（最強紅色）
- G（Green 綠色）控制綠色的強度，數值範圍從 0（無綠色）到 255（最強綠色）
- B（Blue 藍色）控制藍色的強度，數值範圍從 0（無藍色）到 255（最強藍色）

## 🎭 LCH vs. RGB 差在哪？

### ✅ 更直覺的色彩控制

LCH 色彩的三個屬性是獨立的，調整亮度不會影響色相或飽和度，可以更精準地改變顏色

RGB 是一種 加色混合模式，調亮一個顏色通常會讓顏色看起來跑掉 😵

### 👀 更符合人眼視覺

LCH 是根據人眼的感知設計的，代表相同數值變化的效果會比較一致

在 RGB 裡，調整某個顏色的數值，可能在紅色和藍色的影響差很多

但在 LCH 裡，這些變化更均勻，更容易控制色彩 🤩

### 🎨 設計師的好幫手

LCH 在 UI 設計、配色、印刷上超實用

在 UI 設計時，透過 LCH 調整亮度可以確保對比度足夠，而不會讓顏色失真，對無障礙設計來說特別重要 💡

## 🪄 實際案例 - 福哥

在 RGB 模式下，會明顯看到漸層過渡中有不自然的灰濁帶，甚至出現分界線

![RGB 模式的漸層，過渡中出現灰濁帶](https://ibestlibrary.ito.tw/upload/news_b/ALL_news_25D01_Rz5kmGlomq.png)

轉換成 LCH 後⬇️

漸層會顯得更加順暢，顏色過渡均勻，不會有突兀的色調變化

![LCH 模式的漸層，顏色過渡均勻](https://ibestlibrary.ito.tw/upload/news_b/ALL_news_25D01_SMNbmz67ui.png)

## ❓ 如何將 RGB 轉換成 LCH 色彩模式

1. 線上轉換工具
    - [David Johnstone](http://davidjohnstone.net/lch-lab-colour-gradient-picker)：可新增多個顏色，不會產生 CSS 代碼
    - [Learn UI Design](https://www.learnui.design/tools/gradient-generator.html)：漸層顏色最多只能三個，會產生 CSS 代碼
2. Figma 插件 - [Chromatic Figma](https://www.figma.com/community/plugin/759433498184507623/chromatic-figma) **推薦**

    使用方式非常簡單，對想要轉換漸層顏色的物件點選插件，將 Color Mode 選擇 LCH 模式，點擊 Apply 會自動補足顏色轉換前後的差異

    ![在 Figma 選取漸層物件並開啟 Chromatic 插件](https://ibestlibrary.ito.tw/upload/news_b/ALL_news_25D01_Jjj4xnexWo.png)

    ![將 Color Mode 切換為 LCH](https://ibestlibrary.ito.tw/upload/news_b/ALL_news_25D01_hty4YxEPJx.png)

    ![點擊 Apply 後自動補足的漸層色階](https://ibestlibrary.ito.tw/upload/news_b/ALL_news_25D01_Rm1ePcllV0.png)

## 🏆 結論

LCH 色彩模式提供更精確的顏色控制，特別適合用於處理漸層和顏色過渡

與 RGB 模式相比，LCH 更能符合人眼的色彩感知，避免顏色過渡不自然或失真 🎨✨
