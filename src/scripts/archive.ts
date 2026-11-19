import { onPageLoad } from "./page-load";

// 彙整頁依網址參數篩選：?category=、?subcategory=、?tag=、?uncategorized=true
function filterArchive() {
	const list = document.querySelector(".yearList");
	if (!list) return;

	const params = new URLSearchParams(window.location.search);
	const category = params.get("category");
	const subcategory = params.get("subcategory");
	const tag = params.get("tag");
	const uncategorized = params.get("uncategorized") === "true";
	const hasFilter = !!(category || subcategory || tag || uncategorized);

	let shown = 0;
	for (const year of list.querySelectorAll<HTMLElement>(".yearItem")) {
		let count = 0;
		for (const item of year.querySelectorAll<HTMLElement>(".postItem")) {
			const tags: string[] = JSON.parse(item.dataset.tags ?? "[]");
			const match =
				(!category || item.dataset.category === category) &&
				(!subcategory || item.dataset.subcategory === subcategory) &&
				(!tag || tags.includes(tag)) &&
				(!uncategorized || !item.dataset.category);
			item.hidden = !match;
			if (match) count++;
		}
		year.hidden = count === 0;
		const countEl = year.querySelector(".count");
		if (countEl) countEl.textContent = `${count} 篇文章`;
		shown += count;
	}

	const filter = document.getElementById("archive-filter");
	const filterText = document.getElementById("archive-filter-text");
	const empty = document.getElementById("archive-empty");
	if (filter) filter.hidden = !hasFilter;
	if (empty) empty.hidden = shown > 0;
	if (filterText) {
		const parts: string[] = [];
		if (uncategorized) parts.push("未分類");
		if (category)
			parts.push(subcategory ? `${category} / ${subcategory}` : category);
		else if (subcategory) parts.push(subcategory);
		if (tag) parts.push(`# ${tag}`);
		filterText.textContent = parts.join("、");
	}
}

onPageLoad(filterArchive);
