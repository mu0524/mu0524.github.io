import { escapeAttr, escapeHtml, type MdRoot, walk } from "./types";

// ::github{repo="owner/name"} 轉成 GitHub 專案卡片
// 描述、星星數等資料由文章頁的 script 在瀏覽器端向 GitHub API 取得
const REPO = /^[\w.-]+\/[\w.-]+$/;

export function remarkGithubCard() {
	return (tree: MdRoot) => {
		walk(tree, (node, index, parent) => {
			if (node.type !== "leafDirective" || node.name !== "github") return;

			const repo = node.attributes?.repo?.trim() ?? "";
			if (!REPO.test(repo)) return;
			const [owner, name] = repo.split("/");

			const html =
				`<a class="githubCard" href="https://github.com/${escapeAttr(repo)}" target="_blank" rel="noopener" data-repo="${escapeAttr(repo)}">` +
				`<span class="cardTitle"><span class="avatar" data-field="avatar"></span>` +
				`<span class="owner">${escapeHtml(owner)}</span><span class="slash">/</span><span class="name">${escapeHtml(name)}</span></span>` +
				`<span class="cardText" data-field="description">載入中…</span>` +
				`<span class="cardInfo">` +
				`<span class="info star" data-field="stars">-</span>` +
				`<span class="info fork" data-field="forks">-</span>` +
				`<span class="info lang" data-field="language"></span>` +
				"</span></a>";

			parent.children.splice(index, 1, { type: "html", value: html });
			return index + 1;
		});
	};
}
