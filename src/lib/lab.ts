import { type CollectionEntry, getCollection } from "astro:content";

export type LabItem = CollectionEntry<"lab">;

export type LabLang = "html" | "scss" | "js";

export interface LabSource {
	lang: LabLang;
	label: string;
	code: string;
}

// 元件資料夾裡的原始碼，依檔名對應程式碼分頁
const SOURCE_FILES: { file: string; lang: LabLang; label: string }[] = [
	{ file: "index.html", lang: "html", label: "HTML" },
	{ file: "style.scss", lang: "scss", label: "SCSS" },
	{ file: "script.js", lang: "js", label: "JS" },
];

const rawFiles = import.meta.glob<string>(
	"/src/content/lab/*/{index.html,style.scss,script.js}",
	{ query: "?raw", import: "default", eager: true },
);

// 所有元件共用的 SCSS 設定，編譯展示區時接在元件 SCSS 前面
export { default as labSettingScss } from "../content/lab/_setting.scss?raw";

// 新到舊排序；同一天依資料夾名稱排序，讓順序固定
export async function getLabItems(): Promise<LabItem[]> {
	const items = await getCollection(
		"lab",
		({ data }) => !import.meta.env.PROD || !data.draft,
	);
	return items.sort(
		(a, b) =>
			b.data.published.getTime() - a.data.published.getTime() ||
			a.id.localeCompare(b.id),
	);
}

// 沒有的檔案不產生分頁，例如純 CSS 的元件就沒有 JS 分頁
export function getLabSources(id: string): LabSource[] {
	return SOURCE_FILES.flatMap(({ file, lang, label }) => {
		const code = rawFiles[`/src/content/lab/${id}/${file}`];
		return code?.trim() ? [{ lang, label, code: code.trim() }] : [];
	});
}
