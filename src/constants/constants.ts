import type { LIGHT_DARK_MODE, SupportedLang } from "@/types/config";
import { siteConfig } from "../config";

export const PAGE_SIZE = 4;

export const LIGHT_MODE = "light";
export const DARK_MODE = "dark";
export const DEFAULT_MODE: LIGHT_DARK_MODE =
	siteConfig.theme.mode === "light" ? LIGHT_MODE : DARK_MODE;

export const DEFAULT_HUE = siteConfig.theme.hue;

// Banner height unit: vh
export const BANNER_HEIGHT = 35;
export const BANNER_HEIGHT_EXTEND = 30;
export const BANNER_HEIGHT_HOME: number = BANNER_HEIGHT + BANNER_HEIGHT_EXTEND;

// The height the main panel overlaps the banner, unit: rem
export const MAIN_PANEL_OVERLAPS_BANNER_HEIGHT = 3.5;

// Page width: rem
export const PAGE_WIDTH = 80;

export const ALL_LANGUAGES = [
	"en",
	"es",
	"fa",
	"fr",
	"id",
	"ja",
	"ko",
	"th",
	"tr",
	"vi",
	"zh-CN",
	"zh-TW",
] as const;

// 統一成連字號格式（zh_TW → zh-TW），與 SUPPORTED_LANG 一致；
// 否則預設語系含底線時，路由比對失敗，所有頁面都會多一層 /zh-TW/ 前綴
export const DEFAULT_LANG: SupportedLang = siteConfig.lang.replace(
	"_",
	"-",
) as SupportedLang;

const baseLangs =
	siteConfig.supportedLangs && siteConfig.supportedLangs.length > 0
		? siteConfig.supportedLangs.map(
				(lang) => lang.replace("_", "-") as SupportedLang,
			)
		: [];

const activeConfigLang = siteConfig.lang.replace("_", "-") as SupportedLang;

export const SUPPORTED_LANG: readonly SupportedLang[] = baseLangs.includes(
	activeConfigLang,
)
	? baseLangs
	: [activeConfigLang, ...baseLangs];
