import fs from "fs";
import { marked } from "marked";
import matter from "gray-matter";

/* ---------------------------
   Parse FILE_DATES from YAML
----------------------------*/
const fileDates = {};
if (process.env.FILE_DATES) {
  for (const line of process.env.FILE_DATES.split("\n")) {
    if (!line.includes("=")) continue;
    const [file, v] = line.split("=");
    const [created, updated] = v.split("|");
    fileDates[file.trim()] = { created, updated };
  }
}

/* ---------------------------
   Clean blogs
----------------------------*/
if (fs.existsSync("blogs")) {
  fs.rmSync("blogs", { recursive: true, force: true });
}
fs.mkdirSync("blogs");

/* ---------------------------
   Load templates
----------------------------*/
const articleTpl = fs.readFileSync("article.template.html", "utf8");
const indexTpl = fs.readFileSync("index.template.html", "utf8");

let list = "";

/* ---------------------------
   Build all MD
----------------------------*/
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

  const page = articleTpl
    .replaceAll("<!-- replace:title -->", data.title || "")
    .replaceAll("<!-- replace:created -->", created)
    .replaceAll("<!-- replace:updated -->", updated)
    .replaceAll("<!-- replace:tags -->", tags)
    .replaceAll("<!-- replace:content -->", html);

  fs.mkdirSync(`blogs/${id}`, { recursive: true });
  fs.writeFileSync(`blogs/${id}/index.html`, page);

  // 🔥 Card-style list
  list += `
<div class="blog">
  <h2>
    <a href="/blogs/${id}">${data.title}</a>
  </h2>
  <span class="date">${created}</span>
</div>`;

}

/* ---------------------------
   Write index
----------------------------*/
fs.writeFileSync(
  "index.html",
  indexTpl.replace("<!-- replace:blog-list -->", list)
);
/* ---------------------------
   Build sitemap.xml (blogs + root .html only)
----------------------------*/
const siteUrl = (process.env.SITE_URL || "https://example.com").replace(/\/$/, "");
const urls = [];

// helper: get lastmod YYYY-MM-DD
const lastMod = (p) => fs.statSync(p).mtime.toISOString().slice(0, 10);

// 1) ルート直下の .html（index.html を含む）
for (const f of fs.readdirSync(".")) {
  if (f.endsWith(".html") && fs.statSync(f).isFile()) {
    const loc = f === "index.html" ? `${siteUrl}/` : `${siteUrl}/${f}`;
    urls.push({ loc, lastmod: lastMod(f) });
  }
}

// 2) blogs 配下：各記事ディレクトリの index.html のみ
if (fs.existsSync("blogs")) {
  for (const name of fs.readdirSync("blogs")) {
    const dir = `blogs/${name}`;
    const indexPath = `${dir}/index.html`;
    if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
      urls.push({ loc: `${siteUrl}/${dir}/`, lastmod: lastMod(indexPath) });
    }
  }
}

// write sitemap.xml
const sitemapEntries = urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
fs.writeFileSync("sitemap.xml", sitemap, "utf8");


