import { toString as mdToString } from "mdast-util-to-string";
import type { MdRoot, VFileLike } from "./types";

// 中日韓文字一個字算一字，英文、數字以單字計
const CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯]/g;
const LATIN_WORD = /[A-Za-z0-9]+(?:['.-][A-Za-z0-9]+)*/g;

export function countWords(text: string): number {
	const cjk = text.match(CJK)?.length ?? 0;
	const latin = text.replace(CJK, " ").match(LATIN_WORD)?.length ?? 0;
	return cjk + latin;
}

export function remarkWordCount() {
	return (tree: MdRoot, file: VFileLike) => {
		const frontmatter = file.data.astro?.frontmatter;
		if (frontmatter) frontmatter.words = countWords(mdToString(tree));
	};
}
