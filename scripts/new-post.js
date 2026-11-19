// 建立新文章：pnpm new-post <slug>
// 產生 src/content/posts/<slug>/index.md，圖片放在同一個資料夾，用 ./cover.png 這種相對路徑引用

import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2]?.trim();

if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
	console.error("請提供文章網址代稱（小寫英數字與連字號），例如：pnpm new-post css-grid-notes");
	process.exit(1);
}

const dir = path.join("src", "content", "posts", slug);
const file = path.join(dir, "index.md");

if (fs.existsSync(file)) {
	console.error(`已經有這篇文章：${file}`);
	process.exit(1);
}

const today = new Date();
const pad = (n) => String(n).padStart(2, "0");
const date = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

const frontmatter = `---
title: ${slug}
published: ${date}
description: ''
image: ''
tags: []
category: ''
subcategory: ''
draft: true
---
`;

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(file, frontmatter);
console.log(`已建立 ${file}（draft: true，寫完記得改成 false）`);
