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
   Build sitemap.xml
----------------------------*/
const siteUrl = "https://zrpy.f5.si"; // 実サイトの URL に置き換える
const urls = [];

// ルート（index.html）
urls.push({
  loc: `${siteUrl.replace(/\/$/, "")}/`,
  lastmod: new Date().toISOString().slice(0, 10)
});

// blogs 配下の各記事ページを収集
if (fs.existsSync("blogs")) {
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = `${dir}/${name}`;
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        // 各ディレクトリの index.html を対象にする
        const indexPath = `${full}/index.html`;
        if (fs.existsSync(indexPath)) {
          // lastmod を可能なら元データから取得（blogs_raw の FILE_DATES か frontmatter の updated/created を参照）
          // ここではファイルの更新時刻を使用
          const mtime = fs.statSync(indexPath).mtime.toISOString().slice(0, 10);
          const rel = full.replace(/^blogs/, "blogs"); // 相対パスのまま
          urls.push({
            loc: `${siteUrl.replace(/\/$/, "")}/${rel}/`,
            lastmod: mtime
          });
        }
        walk(full);
      }
    }
  };
  walk("blogs");
}
urls.push({
    loc: `${siteUrl.replace(/\/$/, "")}/line_stamp_cloner.html`,
    lastmod: mtime
});
urls.push({
    loc: `${siteUrl.replace(/\/$/, "")}/line_stamp.html`,
    lastmod: mtime
});
// sitemap.xml を組み立てて書き出す
const sitemapEntries = urls.map(u => {
  return `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`;
}).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

fs.writeFileSync("sitemap.xml", sitemap, "utf8");

