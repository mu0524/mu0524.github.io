import { type CollectionEntry, getCollection, render } from "astro:content";
import { categoryUrl, subcategoryUrl, tagUrl } from "./url";

export type Post = CollectionEntry<"posts">;

export const UNCATEGORIZED = "未分類";

const byName = (a: string, b: string) =>
	a.toLowerCase().localeCompare(b.toLowerCase());

// 新到舊排序；同一天發布的依檔名排序，讓順序固定
export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection(
		"posts",
		({ data }) => !import.meta.env.PROD || !data.draft,
	);
	return posts.sort(
		(a, b) =>
			b.data.published.getTime() - a.data.published.getTime() ||
			a.id.localeCompare(b.id),
	);
}

// 沒有填 description 時，取內文第一段純文字當摘要
export function getExcerpt(post: Post, length = 120): string {
	if (post.data.description) return post.data.description;
	const paragraph = (post.body ?? "")
		.split(/\r?\n\s*\r?\n/)
		.map((block) => block.trim())
		.find(
			(block) =>
				block && !/^(#|>|```|:::|::|!\[|<|[-*+] |\d+\. |\|)/.test(block),
		);
	if (!paragraph) return "";
	const text = paragraph
		.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/[`*_~]/g, "")
		.replace(/\s+/g, " ")
		.trim();
	return text.length > length ? `${text.slice(0, length)}…` : text;
}

// 左邊放較新的文章、右邊放較舊的文章
export function getAdjacentPosts(posts: Post[], id: string) {
	const index = posts.findIndex((post) => post.id === id);
	return {
		newer: index > 0 ? posts[index - 1] : undefined,
		older:
			index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
	};
}

export interface TagInfo {
	name: string;
	count: number;
	url: string;
}

export function getTags(posts: Post[]): TagInfo[] {
	const count = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			const name = tag.trim();
			if (name) count.set(name, (count.get(name) ?? 0) + 1);
		}
	}
	return [...count.keys()]
		.sort(byName)
		.map((name) => ({ name, count: count.get(name) ?? 0, url: tagUrl(name) }));
}

export interface CategoryNode extends TagInfo {
	children: TagInfo[];
}

export function getCategoryTree(posts: Post[]): CategoryNode[] {
	const tree = new Map<string, { count: number; subs: Map<string, number> }>();

	for (const post of posts) {
		const name = post.data.category?.trim() || UNCATEGORIZED;
		const node = tree.get(name) ?? { count: 0, subs: new Map() };
		node.count++;
		const sub = post.data.subcategory?.trim();
		if (sub) node.subs.set(sub, (node.subs.get(sub) ?? 0) + 1);
		tree.set(name, node);
	}

	return [...tree.keys()].sort(byName).map((name) => {
		const node = tree.get(name);
		const subs = node?.subs ?? new Map<string, number>();
		return {
			name,
			count: node?.count ?? 0,
			url: categoryUrl(name === UNCATEGORIZED ? undefined : name),
			children: [...subs.keys()].sort(byName).map((sub) => ({
				name: sub,
				count: subs.get(sub) ?? 0,
				url: subcategoryUrl(name, sub),
			})),
		};
	});
}

export interface SiteStats {
	postCount: number;
	categoryCount: number;
	tagCount: number;
	wordCount: number;
	firstPublished?: Date;
	lastActivity?: Date;
}

export async function getSiteStats(posts: Post[]): Promise<SiteStats> {
	let wordCount = 0;
	let firstPublished: Date | undefined;
	let lastActivity: Date | undefined;

	for (const post of posts) {
		const { remarkPluginFrontmatter } = await render(post);
		wordCount += Number(remarkPluginFrontmatter.words) || 0;

		const { published, updated } = post.data;
		const active = updated ?? published;
		if (!firstPublished || published < firstPublished)
			firstPublished = published;
		if (!lastActivity || active > lastActivity) lastActivity = active;
	}

	return {
		postCount: posts.length,
		categoryCount: getCategoryTree(posts).length,
		tagCount: getTags(posts).length,
		wordCount,
		firstPublished,
		lastActivity,
	};
}
