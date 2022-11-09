import fs from "fs-extra";
import mustache from "mustache";
import path from "path";
import webpack from "webpack";
import { getPostAll, Post } from "./Post";

export async function createIndex(isDev: boolean = true) {
    const posts = getAllPost();
    const postFix = isDev ? ".dev" : "";
    const template = fs.readFileSync(
        path.join(__dirname, `../templates/index${postFix}.mustache`),
        "utf-8"
    );
    const indexHTML = mustache.render(template, { posts });
    fs.outputFileSync(path.join(__dirname, "../.build/templates/index.html"), indexHTML);

    await runWebpack(isDev);
}

export function createPosts(outPath?: string) {
    const posts = getAllPost();
    posts.forEach((post) => {
        post.saveHTML(outPath);
    });
}

function getAllPost() {
    return getPostAll()
        .map((filePath) => {
            const { title, contentMD, contentHTML, date, id } = fs.readJSONSync(filePath);
            return new Post(title, contentMD, contentHTML, date, id);
        })
        .sort((a, b) => {
            return b.date.getTime() - a.date.getTime();
        });
}

function runWebpack(isDev: boolean) {
    return new Promise<void>((resolve, reject) => {
        const postFix = isDev ? ".dev" : "";
        const webpackConfig = require(`../webpack.config${postFix}.js`);
        webpack(webpackConfig, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
