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

// 2026-11-17，依台灣時間（push 時間這類實際時刻用，UTC 在早上 8 點前會差一天）
export function formatTaipeiDate(date: Date): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Taipei",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);
}

// 11-17（彙整頁用）
export function formatMonthDay(date: Date): string {
	return `${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export const DAY_MS = 24 * 60 * 60 * 1000;
