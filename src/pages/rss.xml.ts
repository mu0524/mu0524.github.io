import rss from "@astrojs/rss";
import { getPosts } from "@lib/posts";
import { postUrl } from "@lib/url";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { SITE } from "@/site.config";

const parser = new MarkdownIt();

// 全文輸出：Markdown 轉 HTML 後過濾不安全的標籤；文章內的 CodePen 等指令語法會保留原文
export async function GET(context: APIContext) {
	const posts = await getPosts();
	const site = context.site ?? SITE.url;

	return rss({
		title: SITE.title,
		description: SITE.subtitle,
		site,
		customData: `<language>${SITE.lang}</language>`,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.published,
			description: post.data.description,
			link: postUrl(post.id),
			categories: post.data.tags,
			content: sanitizeHtml(parser.render(post.body ?? ""), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
			}),
		})),
	});
}
