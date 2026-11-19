import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
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

const CODE_FONT =
	"'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

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
			reloadScripts: true,
			globalInstance: true,
		}),
		icon({
			include: {
				"material-symbols": ["*"],
			},
		}),
		expressiveCode({
			themes: ["github-dark"],
			plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
			defaultProps: {
				wrap: true,
				overridesByLang: {
					shellsession: { showLineNumbers: false },
				},
			},
			styleOverrides: {
				borderRadius: "0",
				borderColor: "transparent",
				codeBackground: "var(--codeblock-bg)",
				codeFontFamily: CODE_FONT,
				codeFontSize: "0.875rem",
				codeLineHeight: "1.6",
				uiFontFamily: "inherit",
				frames: {
					editorBackground: "var(--codeblock-bg)",
					terminalBackground: "var(--codeblock-bg)",
					editorTabBarBackground: "var(--codeblock-topbar-bg)",
					terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
					editorActiveTabBackground: "transparent",
					editorActiveTabIndicatorTopColor: "transparent",
					editorActiveTabIndicatorBottomColor: "var(--accent-rose)",
					editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
					terminalTitlebarBorderBottomColor: "transparent",
					frameBoxShadowCssValue: "none",
				},
			},
		}),
		sitemap(),
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
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					// _setting.scss 沿用 Laravel 專案的寫法，關閉舊語法的棄用提醒
					silenceDeprecations: [
						"import",
						"global-builtin",
						"if-function",
						"slash-div",
					],
				},
			},
		},
	},
});
