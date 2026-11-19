import { visit } from "unist-util-visit";
import type { MdNode, MdRoot } from "./types";

// 把 GitHub 提示框語法轉成 <aside class="admonition note">
// > [!NOTE]
// > 內容
const LABELS: Record<string, string> = {
	note: "備註",
	tip: "提示",
	important: "重要",
	warning: "警告",
	caution: "注意",
};

const MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*\r?\n?/i;

export function remarkAdmonition() {
	return (tree: MdRoot) => {
		visit(tree, "blockquote", (node: MdNode) => {
			const first = node.children?.[0];
			const text =
				first?.type === "paragraph" ? first.children?.[0] : undefined;
			if (!first || text?.type !== "text" || !text.value) return;

			const match = text.value.match(MARKER);
			if (!match) return;
			const type = match[1].toLowerCase();

			text.value = text.value.slice(match[0].length);
			const rest = first.children ?? [];
			// 標記後面緊接的換行節點一併移除
			if (!text.value) rest.shift();
			if (rest[0]?.type === "break") rest.shift();
			if (rest.length === 0) node.children?.shift();

			node.data = {
				hName: "aside",
				hProperties: { className: ["admonition", type] },
			};
			node.children?.unshift({
				type: "paragraph",
				data: { hProperties: { className: ["admonitionTitle"] } },
				children: [{ type: "text", value: LABELS[type] }],
			});
		});
	};
}
