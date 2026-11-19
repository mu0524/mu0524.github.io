import type {
	AnalyticsConfig,
	CommentConfig,
	DeployConfig,
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Fanggg's Blog",
	subtitle: "個人部落格",
	lang: "zh_TW", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	// Leave it empty `[]` if want disable multi-languages. It can be sorted by array order
	supportedLangs: [],
	theme: {
		hue: 18, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		mode: "light",
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: true, // Display the credit text of the banner image
			text: "畑乃おいも / Hatano Oimo", // Credit text to be displayed
			url: "https://www.pixiv.net/en/artworks/124171254", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.svg',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
		{
			src: "/favicon/favicon.ico",
		},
	],
	ogImage: {
		useDefault: true,
		defaultSrc: "/media/images/banner.jpg",
	},
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/mu0524", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/demo-avatar.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Fanggg",
	bio: "歡迎來到我的部落格！",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://github.com/mu0524",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

// 留言系統：預設關閉。要開啟時到 https://giscus.app/ 取得自己 repo 的 repoId、categoryId，
// 再填入 giscus 設定（欄位見 src/types/config.ts 的 GiscusConfig）
export const commentConfig: CommentConfig = {};

// Site analytics config, only support GA4 for now
export const analyticsConfig: AnalyticsConfig = {
	enabled: false,
	// Example if using Google Analytics, don't forget to make `enabled` true
	// google: {
	//	 id: "G-xxx",
	// },
};

// Deploy configuration (Netlify, GitHub Pages, Coludflared, etc)
export const deployConfig: DeployConfig = {
	siteUrl: "https://mu0524.github.io",
	baseUrl: "/",
};
