// 站內網址一律經過這裡組，部署路徑（base）改變時不用逐一修改

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	const clean = path.startsWith("/") ? path : `/${path}`;
	return `${BASE}${clean}`;
}

export function postUrl(id: string): string {
	return withBase(`/posts/${id}/`);
}

export function labUrl(id?: string): string {
	return withBase(id ? `/lab/${id}/` : "/lab/");
}

// 展示區 iframe 載入的獨立頁面
export function labDemoUrl(id: string): string {
	return withBase(`/lab/${id}/demo.html`);
}

export function pageUrl(page: number): string {
	return withBase(page <= 1 ? "/" : `/${page}/`);
}

interface ArchiveFilter {
	category?: string;
	subcategory?: string;
	tag?: string;
	uncategorized?: boolean;
}

export function archiveUrl(filter: ArchiveFilter = {}): string {
	const params = new URLSearchParams();
	if (filter.uncategorized) params.set("uncategorized", "true");
	if (filter.category) params.set("category", filter.category.trim());
	if (filter.subcategory) params.set("subcategory", filter.subcategory.trim());
	if (filter.tag) params.set("tag", filter.tag.trim());
	const query = params.toString();
	return withBase(`/archive/${query ? `?${query}` : ""}`);
}

export const tagUrl = (tag: string) => archiveUrl({ tag });

export const categoryUrl = (category?: string) =>
	category ? archiveUrl({ category }) : archiveUrl({ uncategorized: true });

export const subcategoryUrl = (category: string, subcategory: string) =>
	archiveUrl({ category, subcategory });
