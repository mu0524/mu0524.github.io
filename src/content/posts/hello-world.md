---
title: Hello World：部落格開張
published: 2026-11-18
description: 使用 Astro + Firefly 主題建立的第一篇文章。
tags: [Astro, 部落格]
category: 隨筆
draft: false
---

這是我用 [Astro](https://astro.build/) 與 [Firefly](https://github.com/CuteLeaf/Firefly) 主題架設的個人部落格的第一篇文章。

## 新增文章

在專案根目錄執行：

```bash
pnpm new-post my-first-post
```

就會在 `src/content/posts/` 產生一篇帶有 frontmatter 的 Markdown 檔案。

## 支援的語法

- 程式碼區塊（Expressive Code，含行號、複製按鈕）
- 數學公式（KaTeX）：$E = mc^2$
- Mermaid 圖表
- 提示框（GitHub 風格）

> [!TIP]
> 更多語法範例可以參考 [Firefly 主題的示範文章](https://github.com/CuteLeaf/Firefly/tree/master/src/content/posts)。
