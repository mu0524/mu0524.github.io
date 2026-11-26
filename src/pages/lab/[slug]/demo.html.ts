import {
	getLabItems,
	getLabSources,
	type LabItem,
	labSettingScss,
} from "@lib/lab";
import type { APIRoute, GetStaticPaths } from "astro";
import * as sass from "sass";

// 展示區 iframe 載入的獨立頁面：把元件的 index.html、style.scss、script.js 組成完整的 HTML
// 跟部落格本身的樣式、swup 換頁隔開，元件的捲動效果、GSAP 都在 iframe 裡獨立運作

export const getStaticPaths = (async () => {
	const items = await getLabItems();
	return items.map((item) => ({ params: { slug: item.id }, props: { item } }));
}) satisfies GetStaticPaths;

const escapeAttr = (value: string) =>
	value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export const GET: APIRoute = ({ props }) => {
	const { item } = props as { item: LabItem };
	const { title, scripts, stylesheets } = item.data;
	const sources = getLabSources(item.id);
	const code = (lang: string) =>
		sources.find((source) => source.lang === lang)?.code ?? "";

	const scss = code("scss");
	// 元件沿用舊版 Sass 寫法（str-index、nth 等全域函式），不顯示棄用警告
	const css = scss
		? sass.compileString(`${labSettingScss}\n${scss}`, {
				style: "expanded",
				logger: sass.Logger.silent,
			}).css
		: "";
	const js = code("js");

	const html = `<!doctype html>
<html lang="zh-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeAttr(title)}</title>
${stylesheets.map((href) => `<link rel="stylesheet" href="${escapeAttr(href)}">`).join("\n")}
<style>
/* 跟元件庫的預覽環境一致，不加 reset，只指定字型 */
body { font-family: "Noto Sans TC", "Microsoft JhengHei", sans-serif; }
${css}
</style>
</head>
<body>
${code("html")}
${scripts.map((src) => `<script src="${escapeAttr(src)}"></script>`).join("\n")}
${js ? `<script>\n${js}\n</script>` : ""}
<script>
// 展示用的連結不換頁
document.addEventListener("click", (event) => {
	if (event.target.closest("a")) event.preventDefault();
});
</script>
</body>
</html>
`;

	return new Response(html, {
		headers: { "Content-Type": "text/html; charset=utf-8" },
	});
};
