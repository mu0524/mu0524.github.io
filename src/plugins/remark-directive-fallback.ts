import { visit } from "unist-util-visit";
import type { MdNode, MdRoot } from "./types";

// remark-directive 會把內文的「:文字」當成指令吃掉（例如 a:hover）
// 沒有外掛處理的指令，在這裡還原成原本的文字
const attrsToText = (node: MdNode) => {
	const pairs = Object.entries(node.attributes ?? {}).map(([k, v]) =>
		v ? `${k}="${v}"` : k,
	);
	return pairs.length ? `{${pairs.join(" ")}}` : "";
};

const text = (value: string): MdNode => ({ type: "text", value });

export function remarkDirectiveFallback() {
	return (tree: MdRoot) => {
		visit(tree, (node: MdNode, index, parent) => {
			if (!parent?.children || index === undefined) return;
			const children = node.children ?? [];
			const attrs = attrsToText(node);

			if (node.type === "textDirective") {
				const label = children.length
					? [text("["), ...children, text("]")]
					: [];
				const restored = [text(`:${node.name}`), ...label];
				if (attrs) restored.push(text(attrs));
				parent.children.splice(index, 1, ...restored);
				return index + restored.length;
			}

			if (node.type === "leafDirective") {
				parent.children.splice(index, 1, {
					type: "paragraph",
					children: [text(`::${node.name}${attrs}`), ...children],
				});
				return index + 1;
			}

			if (node.type === "containerDirective") {
				node.data = {
					hName: "div",
					hProperties: { className: [node.name ?? "directive"] },
				};
			}
		});
	};
}
