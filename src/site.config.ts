// 網站基本設定：改網站名稱、導覽連結、授權時只要改這裡

export const SITE = {
	title: "Fanggg's Blog",
	subtitle: "個人部落格",
	description: "一隻兔子陪你讀前端筆記，CSS、JavaScript 與各種踩坑紀錄。",
	author: "Fanggg",
	lang: "zh-TW",
	url: "https://mu0524.github.io",
	github: "https://github.com/mu0524",
	// 首頁每頁文章數
	pageSize: 6,
	// 文章目錄顯示到第幾層標題（從文章最上層的標題算起）
	tocDepth: 2,
};

export const LICENSE = {
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export type NavIcon = "home" | "archive" | "about" | "github";

export interface NavLink {
	name: string;
	href: string;
	icon: NavIcon;
	external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
	{ name: "首頁", href: "/", icon: "home" },
	{ name: "彙整", href: "/archive/", icon: "archive" },
	{ name: "關於我", href: "/about/", icon: "about" },
	{ name: "GitHub", href: SITE.github, icon: "github", external: true },
];
