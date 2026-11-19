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

export const collections = { posts, pages };
