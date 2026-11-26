import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import swup from "@swup/astro";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import { remarkAdmonition } from "./src/plugins/remark-admonition.ts";
import { remarkCodepen } from "./src/plugins/remark-codepen.ts";
import { remarkDirectiveFallback } from "./src/plugins/remark-directive-fallback.ts";
import { remarkGithubCard } from "./src/plugins/remark-github-card.ts";
import { remarkWordCount } from "./src/plugins/remark-word-count.ts";
import { SITE } from "./src/site.config.ts";

export default defineConfig({
	site: SITE.url,
	base: "/",
	trailingSlash: "ignore",
	integrations: [
		// 換頁時只替換 #swup-container 區塊，導覽區與頁尾保留不重新渲染
		swup({
			theme: false,
			animationClass: "transition-swup-",
			containers: ["#swup-container"],
			smoothScrolling: true,
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			// 不重新執行換頁後的 script，各頁互動統一由 scripts/main.ts 的 onPageLoad 處理
			reloadScripts: false,
			globalInstance: true,
		}),
		icon({
			include: {
				"material-symbols": ["*"],
			},
		}),
		// 設定寫在 ec.config.mjs
		expressiveCode(),
		// Lab 展示區 iframe 的獨立頁面不放進 sitemap
		sitemap({ filter: (page) => !page.endsWith("/demo.html") }),
	],
	markdown: {
		processor: unified({
			remarkRehype: {
				footnoteLabel: "腳註",
				footnoteBackLabel: "回到內文",
			},
			remarkPlugins: [
				remarkWordCount,
				remarkAdmonition,
				remarkDirective,
				remarkCodepen,
				remarkGithubCard,
				remarkDirectiveFallback,
			],
			rehypePlugins: [
				rehypeSlug,
				[
					rehypeAutolinkHeadings,
					{
						behavior: "append",
						properties: {
							className: ["anchor"],
							ariaHidden: "true",
							tabIndex: -1,
							"data-pagefind-ignore": true,
						},
						content: { type: "text", value: "#" },
					},
				],
			],
		}),
	},
});
