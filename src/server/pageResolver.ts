import fs from "fs-extra";
import glob from "glob";
import mustache from "mustache";
import path from "path";
import { Post } from "./Post";

export function createIndex() {
    const posts = getAllPost();
    const template = fs.readFileSync(path.join(__dirname, "../templates/index.mustache"), "utf-8");
    const indexHTML = mustache.render(template, { posts });
    fs.outputFileSync(path.join(__dirname, "wwwroot/index.html"), indexHTML);
}

function getAllPost() {
    return glob
        .sync("posts/**/*.json", {
            cwd: path.join(__dirname, ".."),
        })
        .map((filePath) => {
            const { title, contentMD, contentHTML, date, id } = fs.readJSONSync(filePath);
            return new Post(title, contentMD, contentHTML, date, id);
        })
        .sort((a, b) => {
            return b.date.getTime() - a.date.getTime();
        });
}
