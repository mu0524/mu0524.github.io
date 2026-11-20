// 監看檔案變動，存檔後自動重新 build：pnpm watch
// fanggg.test 指向 dist/，搭配這支腳本就不用每次手動跑 pnpm build

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const targets = ["src", "public", "astro.config.mjs"];
// 連續存檔時等最後一次存檔後再 build
const delay = 800;

let timer = null;
let building = false;
let pending = false;
let lastFile = "";

const time = () => new Date().toLocaleTimeString("zh-TW", { hour12: false });

function build() {
	if (building) {
		// build 途中又有變動，結束後再跑一次
		pending = true;
		return;
	}
	building = true;
	const start = Date.now();
	console.log(`\n[${time()}] ${lastFile} 有變動，開始 build...`);

	const child = spawn("pnpm", ["build"], { cwd: root, shell: true, stdio: ["ignore", "ignore", "pipe"] });
	let errors = "";
	child.stderr.on("data", (chunk) => {
		errors += chunk;
	});

	child.on("close", (code) => {
		building = false;
		const seconds = ((Date.now() - start) / 1000).toFixed(1);
		if (code === 0) {
			console.log(`[${time()}] build 完成（${seconds}s），重新整理 fanggg.test 就看得到`);
		} else {
			console.log(`[${time()}] build 失敗（exit ${code}）：\n${errors}`);
		}
		if (pending) {
			pending = false;
			build();
		}
	});
}

for (const target of targets) {
	const full = path.join(root, target);
	if (!fs.existsSync(full)) continue;
	fs.watch(full, { recursive: true }, (_event, filename) => {
		lastFile = filename ? path.join(target, filename) : target;
		clearTimeout(timer);
		timer = setTimeout(build, delay);
	});
}

console.log(`[${time()}] 監看 ${targets.join("、")} 中，存檔後會自動 build（Ctrl + C 結束）`);
