import fs from "fs";
import { marked } from "marked";
import matter from "gray-matter";

// ----------------------------
// Parse FILE_DATES from GitHub Actions
// ----------------------------
const fileDates = {};

if (process.env.FILE_DATES) {
  const lines = process.env.FILE_DATES.split("\n");
  for (const line of lines) {
    if (!line.includes("=")) continue;

    const eq = line.indexOf("=");
    const file = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    const [created, updated] = value.split("|");

    fileDates[file] = { created, updated };
  }
}

// ----------------------------
// Clean blogs folder
// ----------------------------
if (fs.existsSync("blogs")) {
  fs.rmSync("blogs", { recursive: true, force: true });
}
fs.mkdirSync("blogs");

// ----------------------------
// Load templates
// ----------------------------
const articleTpl = fs.readFileSync("article.template.html", "utf8");
const indexTpl   = fs.readFileSync("index.template.html", "utf8");

let list = "";

// ----------------------------
// Build each markdown
// ----------------------------
for (const file of fs.readdirSync("blogs_raw")) {
  if (!file.endsWith(".md")) continue;

  const id = file.replace(".md", "");
  const raw = fs.readFileSync(`blogs_raw/${file}`, "utf8");
  const { data, content } = matter(raw);

  const html = marked.parse(content);
  const dates = fileDates[`blogs_raw/${file}`] || {};

  const created = data.created || dates.created || "";
  const updated = data.updated || dates.updated || "";

  const tags = (data.tags || "")
    .split(",")
    .map(t => `<span class="tag">${t.trim()}</span>`)
    .join("");

  let page = articleTpl
    .replace("<!-- replace:title -->", data.title || "")
    .replace("<!-- replace:created -->", created)
    .replace("<!-- replace:updated -->", updated)
    .replace("<!-- replace:tags -->", tags)
    .replace("<!-- replace:content -->", html);

  fs.mkdirSync(`blogs/${id}`, { recursive: true });
  fs.writeFileSync(`blogs/${id}/index.html`, page);

  list += `
  <div class="blog">
      <h2><a href="/blogs/${id}">${data.title}</a></h2>
      <span class="date">${created}</span>
  </div>`;
}

// ----------------------------
// Write index.html
// ----------------------------
fs.writeFileSync(
  "index.html",
  indexTpl.replace("<!-- replace:blog-list -->", list)
);
