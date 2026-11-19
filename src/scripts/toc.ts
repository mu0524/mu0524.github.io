// 文章目錄：標出畫面上看得到的段落，並移動左側指示條
import { onPageLoad } from "./page-load";

let cleanup: (() => void) | undefined;

// 每個標題到下一個標題之間算一段，畫面上看得到的段落在目錄標成 visible
function initToc() {
	cleanup?.();
	cleanup = undefined;

	const toc = document.getElementById("toc");
	const area = toc?.parentElement;
	const bar = toc?.querySelector<HTMLElement>(".activeBar");
	const content = document.querySelector<HTMLElement>(".markdownBox");
	if (!toc || !area || !bar || !content) return;

	const entries = [...toc.querySelectorAll<HTMLAnchorElement>(".tocItem")]
		.map((link) => ({
			link,
			heading: document.getElementById(link.dataset.slug ?? ""),
		}))
		.filter(
			(e): e is { link: HTMLAnchorElement; heading: HTMLElement } =>
				!!e.heading,
		);
	if (entries.length === 0) return;

	let ticking = false;

	function update() {
		ticking = false;
		const viewBottom = window.innerHeight;
		const contentBottom = content?.getBoundingClientRect().bottom ?? 0;
		let first = -1;
		let last = -1;

		entries.forEach((entry, i) => {
			const top = entry.heading.getBoundingClientRect().top;
			const bottom =
				entries[i + 1]?.heading.getBoundingClientRect().top ?? contentBottom;
			const visible = top < viewBottom && bottom > 0;
			entry.link.classList.toggle("visible", visible);
			if (visible) {
				if (first < 0) first = i;
				last = i;
			}
		});

		if (!bar) return;
		if (first < 0) {
			bar.style.opacity = "0";
			return;
		}

		const start = entries[first].link;
		const end = entries[last].link;
		bar.style.opacity = "1";
		bar.style.top = `${start.offsetTop}px`;
		bar.style.height = `${end.offsetTop + end.offsetHeight - start.offsetTop}px`;

		// 目錄比畫面長時，捲動目錄讓目前段落保持在可見範圍
		if (area && area.scrollHeight > area.clientHeight) {
			const listTop = toc?.offsetTop ?? 0;
			const viewTop = area.scrollTop;
			const startTop = listTop + start.offsetTop;
			const outOfView =
				startTop < viewTop ||
				startTop + start.offsetHeight > viewTop + area.clientHeight;
			if (outOfView) {
				area.scrollTo({
					top: Math.max(0, startTop - area.clientHeight / 3),
					behavior: "smooth",
				});
			}
		}
	}

	const onScroll = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(update);
	};

	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onScroll, { passive: true });
	cleanup = () => {
		window.removeEventListener("scroll", onScroll);
		window.removeEventListener("resize", onScroll);
	};
	update();
}

onPageLoad(initToc);
