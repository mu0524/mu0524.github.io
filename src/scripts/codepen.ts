import { onPageLoad } from "./page-load";

// 頁面上有 :::codepen 產生的區塊時，依目前深淺色設定主題，再載入 CodePen 嵌入腳本
// 換頁後每次都重新插入腳本，讓 CodePen 重新掃描新內容
const EMBED_SCRIPT = "https://public.codepenassets.com/embed/index.js";

function loadCodepen() {
	const embeds = document.querySelectorAll<HTMLElement>(
		".codepen[data-prefill]",
	);
	if (embeds.length === 0) return;

	const dark = document.documentElement.classList.contains("dark");
	for (const el of embeds) el.dataset.themeId = dark ? "dark" : "light";

	document.getElementById("codepen-embed-script")?.remove();
	const script = document.createElement("script");
	script.id = "codepen-embed-script";
	script.src = EMBED_SCRIPT;
	script.async = true;
	document.body.appendChild(script);
}

onPageLoad(loadCodepen);
