import { visit } from "unist-util-visit";
import { escapeAttr, escapeHtml, type MdNode, type MdRoot } from "./types";

/**
 * 把 :::codepen 容器轉成 CodePen Prefill Embed，不需要先在 CodePen 建立 Pen
 *
 * :::codepen{title="範例標題" height="400" tab="result" scripts="https://a.js,https://b.js"}
 * ```html
 * ...
 * ```
 * ```css
 * ...
 * ```
 * :::
 *
 * - tab：預設顯示的分頁，例如 "result"、"css,result"
 * - scripts / stylesheets：外部資源網址，多個用逗號分隔
 *
 * https://blog.codepen.io/documentation/prefill-embeds/
 *
 * 嵌入腳本由 src/scripts/codepen.ts 在頁面載入與換頁後載入
 */

const LANG_ALIAS: Record<string, string> = {
	html: "html",
	css: "css",
	scss: "scss",
	js: "js",
	javascript: "js",
	ts: "ts",
	typescript: "ts",
};

const splitList = (value?: string | null) =>
	(value ?? "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);

export function remarkCodepen() {
	return (tree: MdRoot) => {
		visit(tree, "containerDirective", (node: MdNode, index, parent) => {
			if (node.name !== "codepen" || !parent?.children || index === undefined)
				return;

			const attrs = node.attributes ?? {};
			const blocks = (node.children ?? [])
				.filter((child) => child.type === "code")
				.map((child) => ({
					lang: LANG_ALIAS[(child.lang ?? "").toLowerCase()],
					value: child.value ?? "",
				}))
				.filter((block) => block.lang);

			if (blocks.length === 0) return;

			const prefill = {
				title: attrs.title || "Demo",
				scripts: splitList(attrs.scripts),
				stylesheets: splitList(attrs.stylesheets),
			};

			const pres = blocks
				.map((b) => `<pre data-lang="${b.lang}">${escapeHtml(b.value)}</pre>`)
				.join("");

			const html =
				`<div class="codepenBox">` +
				`<div class="codepen" data-prefill="${escapeAttr(JSON.stringify(prefill))}"` +
				` data-height="${escapeAttr(attrs.height || "400")}"` +
				` data-default-tab="${escapeAttr(attrs.tab || "result")}"` +
				` data-editable="true">${pres}</div></div>`;

			parent.children.splice(index, 1, { type: "html", value: html });
			return index + 1;
		});
	};
}
