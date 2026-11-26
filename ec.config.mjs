import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { defineEcConfig } from "astro-expressive-code";

// Expressive Code 設定獨立成這個檔，Lab 內頁的 <Code> 元件才讀得到同一份設定
const CODE_FONT =
	"'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

export default defineEcConfig({
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
});
