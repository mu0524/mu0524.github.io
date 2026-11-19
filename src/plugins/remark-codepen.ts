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
 */

const EMBED_SCRIPT = "https://public.codepenassets.com/embed/index.js";

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

// 依網站目前的深淺色設定 CodePen 主題，再載入嵌入腳本
// 換頁後這段會重新執行，所以每次都插入新的 script 讓 CodePen 重新掃描
const LOADER_SCRIPT = `(() => {
  const dark = document.documentElement.classList.contains("dark");
  document.querySelectorAll(".codepen[data-prefill]").forEach((el) => {
    el.dataset.themeId = dark ? "dark" : "light";
  });
  document.getElementById("codepen-embed-script")?.remove();
  const s = document.createElement("script");
  s.id = "codepen-embed-script";
  s.src = "${EMBED_SCRIPT}";
  s.async = true;
  document.body.appendChild(s);
})();`;

export function remarkCodepen() {
	return (tree: MdRoot) => {
		let found = false;

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
			found = true;

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

		if (found) {
			tree.children.push({
				type: "html",
				value: `<script>${LOADER_SCRIPT}</script>`,
			});
		}
	};
}
