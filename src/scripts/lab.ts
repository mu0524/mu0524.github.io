import { onPageLoad } from "./page-load";

// Lab 內頁：展示區的重新整理、裝置寬度切換，以及程式碼分頁
function initLabDemo() {
	const demo = document.querySelector<HTMLElement>("[data-lab-demo]");
	if (!demo) return;

	const frameBox = demo.querySelector<HTMLElement>(".frameBox");
	const iframe = demo.querySelector("iframe");
	const deviceBtns =
		demo.querySelectorAll<HTMLButtonElement>("[data-lab-device]");

	demo.querySelector("[data-lab-reload]")?.addEventListener("click", () => {
		// 展示頁跟部落格同網域，可以直接重新載入讓元件從頭播放
		iframe?.contentWindow?.location.reload();
	});

	for (const btn of deviceBtns) {
		btn.addEventListener("click", () => {
			if (frameBox) frameBox.dataset.device = btn.dataset.labDevice;
			for (const other of deviceBtns) {
				other.setAttribute("aria-pressed", String(other === btn));
			}
		});
	}
}

function initLabCode() {
	const code = document.querySelector<HTMLElement>("[data-lab-code]");
	if (!code) return;

	const tabs = [...code.querySelectorAll<HTMLButtonElement>('[role="tab"]')];

	const select = (tab: HTMLButtonElement) => {
		for (const other of tabs) {
			const selected = other === tab;
			other.setAttribute("aria-selected", String(selected));
			other.tabIndex = selected ? 0 : -1;
			const panel = document.getElementById(
				other.getAttribute("aria-controls") ?? "",
			);
			if (panel) panel.hidden = !selected;
		}
	};

	tabs.forEach((tab, index) => {
		tab.addEventListener("click", () => select(tab));
		// 左右方向鍵切換分頁
		tab.addEventListener("keydown", (event) => {
			const step =
				event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
			if (!step) return;
			event.preventDefault();
			const next = tabs[(index + step + tabs.length) % tabs.length];
			select(next);
			next.focus();
		});
	});
}

onPageLoad(() => {
	initLabDemo();
	initLabCode();
});
