import fs from "fs";
import { marked } from "marked";
import matter from "gray-matter";
import fs from "fs";
if (fs.existsSync("blogs")) {
  fs.rmSync("blogs", { recursive: true, force: true });
}
fs.mkdirSync("blogs");


const articleTpl = fs.readFileSync("article.template.html", "utf8");
const indexTpl = fs.readFileSync("index.template.html", "utf8");

let listHtml = "";

for (const file of fs.readdirSync("blogs_raw")) {
  const id = file.replace(".md", "");
  const { data, content } = matter(fs.readFileSync("blogs_raw/" + file, "utf8"));
  const html = marked.parse(content);

  let page = articleTpl
    .replace("<!-- replace:title -->", data.title)
    .replace("<!-- replace:date -->", data.date || "")
    .replace(
      "<!-- replace:tags -->",
      (data.tags || "")
        .split(",")
        .map(t => `<span class="tag">${t.trim()}</span>`)
        .join("")
    )
    .replace("<!-- replace:content -->", html);

  fs.mkdirSync("blogs/" + id, { recursive: true });
  fs.writeFileSync("blogs/" + id + "/index.html", page);

  listHtml += `
<div class="blog">
  <h2><a href="/blogs/${id}">${data.title}</a></h2>
</div>`;
}

fs.writeFileSync(
  "index.html",
  indexTpl.replace("<!-- replace:blog-list -->", listHtml)
);
