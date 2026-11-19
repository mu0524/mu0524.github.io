// remark 外掛共用的最小節點型別，只描述外掛用到的欄位
export interface MdNode {
	type: string;
	name?: string;
	value?: string;
	lang?: string | null;
	attributes?: Record<string, string | null | undefined> | null;
	children?: MdNode[];
	data?: Record<string, unknown>;
}

export interface MdRoot extends MdNode {
	type: "root";
	children: MdNode[];
}

export interface VFileLike {
	data: { astro?: { frontmatter?: Record<string, unknown> } };
}

export const escapeHtml = (str: string) =>
	str.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export const escapeAttr = (str: string) =>
	escapeHtml(str).replaceAll('"', "&quot;").replaceAll("'", "&#39;");

// 走訪 Markdown 節點樹；visitor 回傳數字時，從該索引繼續、不進入被替換的節點
type Visitor = (
	node: MdNode,
	index: number,
	parent: MdNode & { children: MdNode[] },
) => number | undefined | void;

export function walk(tree: MdNode, visitor: Visitor) {
	const children = tree.children;
	if (!children) return;
	const parent = tree as MdNode & { children: MdNode[] };
	let i = 0;
	while (i < children.length) {
		const next = visitor(children[i], i, parent);
		if (typeof next === "number") {
			i = next;
			continue;
		}
		walk(children[i], visitor);
		i++;
	}
}
