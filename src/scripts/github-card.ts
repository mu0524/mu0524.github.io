import { onPageLoad } from "./page-load";

// 填入 ::github 卡片的專案資料；結果存在 sessionStorage，避免換頁重複呼叫 GitHub API
interface RepoInfo {
	description: string;
	stars: number;
	forks: number;
	language: string;
	avatar: string;
}

const CACHE_PREFIX = "github-card:";

async function getRepo(repo: string): Promise<RepoInfo | null> {
	try {
		const cached = sessionStorage.getItem(CACHE_PREFIX + repo);
		if (cached) return JSON.parse(cached);
	} catch {}

	const res = await fetch(`https://api.github.com/repos/${repo}`);
	if (!res.ok) return null;
	const data = await res.json();
	const info: RepoInfo = {
		description: data.description ?? "",
		stars: data.stargazers_count ?? 0,
		forks: data.forks_count ?? 0,
		language: data.language ?? "",
		avatar: data.owner?.avatar_url ?? "",
	};
	try {
		sessionStorage.setItem(CACHE_PREFIX + repo, JSON.stringify(info));
	} catch {}
	return info;
}

const format = (n: number) =>
	n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);

function fill(card: HTMLElement, info: RepoInfo | null) {
	const field = (name: string) =>
		card.querySelector<HTMLElement>(`[data-field="${name}"]`);
	const description = field("description");

	if (!info) {
		if (description) description.textContent = "無法取得專案資訊";
		return;
	}
	if (description)
		description.textContent = info.description || "這個專案沒有填寫描述";
	const stars = field("stars");
	const forks = field("forks");
	const language = field("language");
	const avatar = field("avatar");
	if (stars) stars.textContent = format(info.stars);
	if (forks) forks.textContent = format(info.forks);
	if (language) language.textContent = info.language;
	if (avatar && info.avatar)
		avatar.style.backgroundImage = `url(${info.avatar})`;
}

function initCards() {
	for (const card of document.querySelectorAll<HTMLElement>(
		".githubCard[data-repo]",
	)) {
		const repo = card.dataset.repo;
		if (repo)
			getRepo(repo)
				.then((info) => fill(card, info))
				.catch(() => fill(card, null));
	}
}

onPageLoad(initCards);
