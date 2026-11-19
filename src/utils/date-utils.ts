export function formatDateToYYYYMMDD(date: Date): string {
	return date.toISOString().substring(0, 10);
}

const MONTH_NAMES = [
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

// 文章卡日期，例：2026 Nov 17（與 formatDateToYYYYMMDD 一樣以 UTC 計算）
export function formatDateToYYYYMMMD(date: Date): string {
	return `${date.getUTCFullYear()} ${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCDate()}`;
}
