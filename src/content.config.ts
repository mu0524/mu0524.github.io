import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// 空字串、null 視為沒有填，讓 frontmatter 的 image: '' 與 category: '' 都能通過
const emptyToUndefined = (value: unknown) =>
	value === null || (typeof value === "string" && value.trim() === "")
		? undefined
		: value;

const posts = defineCollection({
	loader: glob({ base: "./src/content/posts", pattern: "**/*.md" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			published: z.coerce.date(),
			updated: z.coerce.date().optional(),
			draft: z.boolean().default(false),
			description: z.string().default(""),
			image: z.preprocess(emptyToUndefined, image().optional()),
			tags: z.array(z.string()).default([]),
			category: z.preprocess(emptyToUndefined, z.string().optional()),
			subcategory: z.preprocess(emptyToUndefined, z.string().optional()),
		}),
});

// 關於我等獨立頁面的內文
const pages = defineCollection({
	loader: glob({ base: "./src/content/pages", pattern: "**/*.md" }),
	schema: z.object({
		title: z.string().optional(),
	}),
});

// Lab 元件展示：每個元件一個資料夾，index.md 寫說明，
// 同資料夾的 index.html、style.scss、script.js 是展示區與程式碼分頁的來源（見 lib/lab.ts）
const lab = defineCollection({
	loader: glob({ base: "./src/content/lab", pattern: "*/index.md" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			published: z.coerce.date(),
			draft: z.boolean().default(false),
			description: z.string().default(""),
			tags: z.array(z.string()).default([]),
			// 列表卡片的預覽 GIF，16:9
			preview: z.preprocess(emptyToUndefined, image().optional()),
			// 展示區 iframe 的高度（px）
			demoHeight: z.number().default(600),
			// 展示區要另外載入的外部 JS / CSS（例如 GSAP 的 CDN 網址）
			scripts: z.array(z.string()).default([]),
			stylesheets: z.array(z.string()).default([]),
		}),
});

export const collections = { posts, pages, lab };
