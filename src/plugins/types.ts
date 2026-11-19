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
