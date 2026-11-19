// @swup/astro 換頁時會在 document 上觸發 astro:page-load、astro:before-swap
// #swup-container 的內容換頁後會被替換，綁在內文元素上的事件要靠這裡重新綁定

// 首次載入與每次換頁完成後都執行
export function onPageLoad(callback: () => void) {
	callback();
	document.addEventListener("astro:page-load", callback);
}

// 換頁替換內容前執行，用來清掉燈箱實體等
export function onPageLeave(callback: () => void) {
	document.addEventListener("astro:before-swap", callback);
}
