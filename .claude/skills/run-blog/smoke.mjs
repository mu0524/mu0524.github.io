// 用法：node .claude/skills/run-blog/smoke.mjs <截圖輸出資料夾> [base url]
import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const root = process.cwd();
const require = createRequire(join(root, "package.json"));
const { chromium } = require("playwright");

const out = process.argv[2] ?? ".";
const base = process.argv[3] ?? "http://localhost:4321";
const posts = readdirSync(join(root, "src/content/posts"), { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => d.name);

const IGNORE = ["codepen", "status of 403"];
const errors = [];

// 1. HTTP 狀態
for (const p of ["/", "/archive/", ...posts.map((s) => `/posts/${s}/`)]) {
	const res = await fetch(base + p);
	console.log(`HTTP ${res.status} ${p}`);
	if (res.status !== 200) errors.push(`HTTP ${res.status} ${p}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => errors.push(`pageerror @ ${page.url()}: ${e.stack}`));
page.on("console", (m) => {
	if (m.type() === "error" && !IGNORE.some((k) => m.text().includes(k))) {
		errors.push(`console @ ${page.url()}: ${m.text()}`);
	}
});

const footerState = () =>
	page.$$eval(".footerArea .categoryItem", (items) =>
		items.map((i) => ({
			name: i.dataset.category,
			close: i.classList.contains("close"),
			current: i.classList.contains("current"),
			currentSub: [...i.querySelectorAll(".subItem.current")].map((s) => s.dataset.subcategory),
		})),
	);
const shotFooter = async (name) => {
	await page.locator(".footerArea").scrollIntoViewIfNeeded();
	await page.locator(".footerArea").screenshot({ path: join(out, name) });
};

// 2. 首頁
await page.goto(`${base}/`, { waitUntil: "networkidle" });
await page.screenshot({ path: join(out, "home.png") });
console.log("首頁 footer:", JSON.stringify(await footerState()));
await shotFooter("home-footer.png");

// 3. 直接進第一篇文章
if (posts[0]) {
	await page.goto(`${base}/posts/${posts[0]}/`, { waitUntil: "networkidle" });
	await page.screenshot({ path: join(out, "post.png") });
	console.log(`文章 ${posts[0]} footer:`, JSON.stringify(await footerState()));
	await shotFooter("post-footer.png");
}

// 4. 從首頁用 swup 換頁到最後一篇文章
const last = posts.at(-1);
if (last) {
	await page.goto(`${base}/`, { waitUntil: "networkidle" });
	const link = page.locator(`a[href*="/posts/${last}"]`).first();
	if (await link.count()) {
		await link.click();
		await page.waitForURL(new RegExp(last));
		await page.waitForTimeout(1200);
		console.log(`swup → ${last} footer:`, JSON.stringify(await footerState()));
		await shotFooter("swup-footer.png");
	} else {
		console.log(`首頁找不到 ${last} 的連結，略過 swup 換頁檢查`);
	}
}

// 5. 手機寬度
await page.setViewportSize({ width: 375, height: 800 });
await page.goto(`${base}/posts/${posts[0]}/`, { waitUntil: "networkidle" });
await page.screenshot({ path: join(out, "mobile-post.png") });

await browser.close();
console.log(`截圖：${out}`);
console.log("ERRORS:", errors.length ? `\n${errors.join("\n")}` : "none");
