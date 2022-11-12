import fs from "fs-extra";
import { getAllPostFilePath, Post } from "../model/Post";

export function createPosts(outPath?: string) {
    const posts = getAllPost();
    posts.forEach((post) => {
        post.saveHTML(outPath);
    });
}

export function getAllPost() {
    return getAllPostFilePath()
        .map((filePath) => {
            const { title, contentMD, contentHTML, date, id } = fs.readJSONSync(filePath);
            return new Post(title, contentMD, contentHTML, date, id);
        })
        .sort((a, b) => {
            return b.date.getTime() - a.date.getTime();
        });
}
