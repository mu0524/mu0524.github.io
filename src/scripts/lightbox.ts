import "photoswipe/style.css";
import type PhotoSwipe from "photoswipe";
import { onPageLeave, onPageLoad } from "./page-load";

// 點文章內的圖片放大檢視；PhotoSwipe 第一次點圖才載入
const SELECTOR = ".markdownBox img, .postArea > .Img img";

let viewer: PhotoSwipe | undefined;

async function open(img: HTMLImageElement) {
	const { default: PhotoSwipe } = await import("photoswipe");
	viewer = new PhotoSwipe({
		dataSource: [
			{
				src: img.currentSrc || img.src,
				width: img.naturalWidth || window.innerWidth,
				height: img.naturalHeight || window.innerHeight,
				alt: img.alt,
			},
		],
		padding: { top: 20, bottom: 20, left: 20, right: 20 },
		bgOpacity: 0.85,
		wheelToZoom: true,
		arrowPrev: false,
		arrowNext: false,
		counter: false,
		imageClickAction: "close",
		tapAction: "close",
		doubleTapAction: "zoom",
	});
	viewer.on("destroy", () => {
		viewer = undefined;
	});
	viewer.init();
}

function bind() {
	for (const img of document.querySelectorAll<HTMLImageElement>(SELECTOR)) {
		// 連結裡的圖、標記 data-no-zoom 的裝飾插圖不放大
		if (img.closest("a, [data-no-zoom]")) continue;
		img.addEventListener("click", () => open(img));
	}
}

onPageLoad(bind);
onPageLeave(() => viewer?.destroy());
