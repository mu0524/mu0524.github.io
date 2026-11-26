import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

// 頁尾「最後活動」顯示最後一次 push 的時間，build 時取得：
// 1. GitHub Actions 由 push 觸發時，事件內容的 repository.pushed_at 就是 push 的時間
// 2. 手動觸發部署或在本機 build 時，改用已推上遠端的最新 commit 時間

function readPushedAt(): Date | undefined {
	const eventPath = process.env.GITHUB_EVENT_PATH;
	if (!eventPath) return undefined;

	try {
		const event = JSON.parse(readFileSync(eventPath, "utf8"));
		const pushedAt = event.repository?.pushed_at;
		// push 事件是 Unix 秒數，其他事件是 ISO 字串
		if (typeof pushedAt === "number") return new Date(pushedAt * 1000);
		if (typeof pushedAt === "string") return new Date(pushedAt);
	} catch {
		// 讀不到事件內容時改用 commit 時間
	}
	return undefined;
}

function readCommitTime(ref: string): Date | undefined {
	try {
		const iso = execSync(`git log -1 --format=%cI ${ref}`, {
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
		return iso ? new Date(iso) : undefined;
	} catch {
		// 沒有 git 或沒有追蹤的遠端分支
		return undefined;
	}
}

// 每頁的頁尾都會用到，build 時只讀一次
let cached: { value: Date | undefined } | undefined;

export function getLastPushTime(): Date | undefined {
	// @{u} 是遠端追蹤分支，也就是最後一次 push 上去的 commit；CI 的 checkout 沒有追蹤分支，改用 HEAD
	cached ??= {
		value:
			readPushedAt() ?? readCommitTime("@{u}") ?? readCommitTime("HEAD"),
	};
	return cached.value;
}
