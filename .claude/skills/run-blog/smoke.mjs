// 用法：node .claude/skills/run-blog/smoke.mjs <截圖輸出資料夾> [base url]
// Playwright 不在專案依賴裡，從環境變數 PW_DIR 指定的資料夾載入（見 SKILL.md 步驟 4）
import { existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const root = process.cwd();
const pwDir = process.env.PW_DIR;
if (!pwDir || !existsSync(join(pwDir, "node_modules/playwright"))) {
	console.error(
		"找不到 Playwright，請先依 SKILL.md 步驟 4 安裝，並設定 PW_DIR",
	);
	process.exit(1);
}
const { chromium } = createRequire(join(pwDir, "package.json"))("playwright");

const out = process.argv[2] ?? ".";
const base = process.argv[3] ?? "http://localhost:4321";
const posts = readdirSync(join(root, "src/content/posts"), {
	withFileTypes: true,
})
	.filter((d) => d.isDirectory())
	.map((d) => d.name);

// dev 模式下 pagefind 索引與 sitemap 只有 build 才會產生；CodePen 會擋自動化瀏覽器
const IGNORE = ["codepen", "status of 403", "pagefind"];
const errors = [];

// 1. HTTP 狀態
const routes = [
	"/",
	"/archive/",
	"/about/",
	"/rss.xml",
	"/robots.txt",
	...posts.map((s) => `/posts/${s}/`),
];
for (const p of routes) {
	const res = await fetch(base + p);
	console.log(`HTTP ${res.status} ${p}`);
	if (res.status !== 200) errors.push(`HTTP ${res.status} ${p}`);
}
const notFound = await fetch(`${base}/no-such-page/`);
console.log(`HTTP ${notFound.status} /no-such-page/（預期 404）`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
page.on("pageerror", (e) =>
	errors.push(`pageerror @ ${page.url()}: ${e.stack}`),
);
// 「Failed to load resource」的 console 訊息不帶網址，改從 response 記錄失敗的資源
page.on("response", (r) => {
	const url = r.url();
	if (
		r.status() < 400 ||
		IGNORE.some((k) => url.includes(k)) ||
		url.includes("no-such-page")
	)
		return;
	errors.push(`HTTP ${r.status()} ${url}（頁面：${page.url()}）`);
});
page.on("console", (m) => {
	const t = m.text();
	if (
		m.type() !== "error" ||
		t.startsWith("Failed to load resource") ||
		IGNORE.some((k) => t.includes(k))
	)
		return;
	errors.push(`console @ ${page.url()}: ${t}`);
});

const footer = () =>
	page.$$eval(".footerArea .categoryItem", (items) =>
		items
			.map((i) => {
				const state = i.classList.contains("close") ? "[收]" : "[開]";
				const cur = i.classList.contains("current") ? "*" : "";
				const subs = [...i.querySelectorAll(".subItem.current")]
					.map((s) => `/${s.dataset.subcategory}`)
					.join("");
				return `${i.dataset.category}${state}${cur}${subs}`;
			})
			.join(" "),
	);
const isDark = () =>
	page.evaluate(() => document.documentElement.classList.contains("dark"));
const go = async (path) => page.goto(base + path, { waitUntil: "networkidle" });

// 2. 各頁截圖
for (const [path, name] of [
	["/", "home"],
	["/archive/", "archive"],
	["/about/", "about"],
	["/no-such-page/", "404"],
]) {
	await go(path);
	await page.screenshot({ path: join(out, `${name}.png`) });
}

// 3. 文章頁：目錄（1536 以上才顯示）、上下篇
const first = posts[0];
await go(`/posts/${first}/`);
await page.screenshot({ path: join(out, "post.png") });
await page.mouse.wheel(0, 2500);
await page.waitForTimeout(800);
await page.screenshot({ path: join(out, "post-toc.png") });
console.log(
	`文章 ${first}：目錄 ${await page.$$eval(".tocArea a", (a) => a.length)} 項`,
);
console.log(`文章 ${first} footer:`, await footer());
const navLinks = await page.$$eval(".pageNavBox a", (as) =>
	as.map((a) => a.getAttribute("aria-label")),
);
console.log("上下篇:", navLinks.join(" | ") || "無");
if (navLinks.length) {
	await page.locator(".pageNavBox a").first().click();
	await page.waitForTimeout(1500);
	console.log(`點上下篇 → ${page.url()}，footer: ${await footer()}`);
}

// 4. swup 換頁：首頁 → 最後一篇 → 彙整，接著點一次深色切換，應該只切一次
await go("/");
console.log("首頁 footer:", await footer());
const last = posts.at(-1);
const link = page.locator(`a[href*="/posts/${last}"]`).first();
if (await link.count()) {
	await link.click();
	await page.waitForURL(new RegExp(last));
	await page.waitForTimeout(1200);
	console.log(`swup → ${last} footer:`, await footer());
}
await page.locator('a[href*="/archive"]').first().click();
await page.waitForURL(/archive/);
await page.waitForTimeout(1200);
const before = await isDark();
await page.click("#theme-toggle");
await page.waitForTimeout(500);
const after = await isDark();
console.log(
	`換頁後點一次深色切換：dark ${before} → ${after}${before === after ? "（沒有切換，異常）" : ""}`,
);
if (before === after) errors.push("深色切換點一次沒有切換");
await page.screenshot({ path: join(out, "archive-theme.png") });
await page.click("#theme-toggle"); // 切回原本的模式

// 5. 頁尾收合鈕、搜尋面板
await page.click(".footerArea .toggle");
await page.waitForTimeout(400);
console.log("點收合鈕後 footer:", await footer());
await page.click("#search-toggle");
await page.waitForTimeout(400);
console.log(
	"搜尋面板打開:",
	!(await page.$eval("#search-panel", (e) => e.hidden)),
);

// 6. 手機寬度
await page.setViewportSize({ width: 375, height: 800 });
await go(`/posts/${first}/`);
await page.screenshot({ path: join(out, "mobile-post.png") });
await go("/");
await page.screenshot({ path: join(out, "mobile-home.png") });
const overflow = await page.evaluate(
	() => document.documentElement.scrollWidth - window.innerWidth,
);
console.log(`手機首頁水平溢出：${overflow}px`);
if (overflow > 0) errors.push(`手機首頁水平溢出 ${overflow}px`);

await browser.close();
console.log(`截圖：${out}`);
console.log("ERRORS:", errors.length ? `\n${errors.join("\n")}` : "none");
