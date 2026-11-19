// 日期一律用 UTC 顯示，避免 build 主機時區不同造成日期差一天

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

const pad = (n: number) => String(n).padStart(2, "0");

// 2026 Nov 17
export function formatDate(date: Date): string {
	return `${date.getUTCFullYear()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

// 2026-11-17
export function formatIsoDate(date: Date): string {
	return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

// 11-17（彙整頁用）
export function formatMonthDay(date: Date): string {
	return `${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export const DAY_MS = 24 * 60 * 60 * 1000;
