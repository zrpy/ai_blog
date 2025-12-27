import fs from "fs";
import { marked } from "marked";
import matter from "gray-matter";

// ---------- load git dates from env ----------
const fileDates = Object.fromEntries(
  (process.env.FILE_DATES || "")
    .split("\n")
    .filter(Boolean)
    .map(l => {
      const [f, v] = l.split("=");
      const [c, u] = v.split("|");
      return [f, { created: c, updated: u }];
    })
);

// ---------- clean blogs ----------
if (fs.existsSync("blogs")) {
  fs.rmSync("blogs", { recursive: true, force: true });
}
fs.mkdirSync("blogs");

// ---------- load templates ----------
const articleTpl = fs.readFileSync("article.html", "utf8");
const indexTpl   = fs.readFileSync("index.html", "utf8");

let list = "";

// ---------- build each md ----------
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
  <div class="meta">${created}</div>
</div>`;
}

// ---------- write index ----------
fs.writeFileSync(
  "index.html",
  indexTpl.replace("<!-- replace:blog-list -->", list)
);
