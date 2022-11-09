import fs from "fs-extra";
import mustache from "mustache";
import path from "path";
import webpack from "webpack";
import { getPostAll, Post } from "./Post";

export function createIndex(outPath?: string, isDev: boolean = true) {
    outPath = outPath ?? path.join(__dirname, "../.build/templates");
    const posts = getAllPost();
    const postFix = isDev ? ".dev" : "";
    const template = fs.readFileSync(
        path.join(__dirname, `../templates/index${postFix}.mustache`),
        "utf-8"
    );
    const indexHTML = mustache.render(template, { posts });
    fs.outputFileSync(path.join(outPath, "index.html"), indexHTML);

    // TODO 웹팩 실행해야 함
}

export function createPosts(outPath?: string) {
    const posts = getAllPost();
    posts.forEach((post) => {
        post.saveHTML(outPath);
    });
}

let _posts: Post[] | undefined;
function getAllPost() {
    if (!_posts) {
        _posts = getPostAll()
            .map((filePath) => {
                const { title, contentMD, contentHTML, date, id } = fs.readJSONSync(filePath);
                return new Post(title, contentMD, contentHTML, date, id);
            })
            .sort((a, b) => {
                return b.date.getTime() - a.date.getTime();
            });
    }
    return _posts;
}
