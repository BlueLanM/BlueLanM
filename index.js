import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const thisYear = new Date().getFullYear();
const startTimeOfThisYear = new Date(`${thisYear}-01-01T00:00:00+00:00`).getTime();
const endTimeOfThisYear = new Date(`${thisYear}-12-31T23:59:59+00:00`).getTime();
const progressOfThisYear = (Date.now() - startTimeOfThisYear) / (endTimeOfThisYear - startTimeOfThisYear);
const progressBarOfThisYear = generateProgressBar();

function generateProgressBar() {
	const progressBarCapacity = 30;
	const passedProgressBarIndex = parseInt(progressOfThisYear * progressBarCapacity);
	const progressBar
      = "█".repeat(passedProgressBarIndex)
      + "▁".repeat(progressBarCapacity - passedProgressBarIndex);
	return `{ ${progressBar} }`;
}

const progressContent = `⏳ Year progress ${progressBarOfThisYear} ${(progressOfThisYear * 100).toFixed(2)} %

⏰ Updated on ${new Date().toUTCString()}`;

// 读取 README.md 文件
const readmePath = path.join(__dirname, "README.md");
let readmeContent = fs.readFileSync(readmePath, "utf-8");

// 替换占位符之间的内容
const startMarker = "<!-- YEAR_PROGRESS starts -->";
const endMarker = "<!-- YEAR_PROGRESS ends -->";
const startIndex = readmeContent.indexOf(startMarker);
const endIndex = readmeContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
	const before = readmeContent.substring(0, startIndex + startMarker.length);
	const after = readmeContent.substring(endIndex);
	readmeContent = `${before}\n${progressContent}\n${after}`;

	// 写回文件
	fs.writeFileSync(readmePath, readmeContent, "utf-8");
	console.log("✅ README.md updated successfully!");
} else {
	console.error("❌ Could not find YEAR_PROGRESS markers in README.md");
	process.exit(1);
}