import express from "express";
import path from "path";
import fs from "fs-extra";
import glob from "glob";

import { Post } from "./Post";

const port = 3000;

const app = express();
app.use(express.static(path.join(__dirname, "wwwroot")));
app.use(express.json());

app.post("/api/post", (req, res) => {
    const { title, contentMD, contentHTML } = req.body ?? {};
    if (!title || !contentMD || !contentHTML) {
        res.sendStatus(400);
        return;
    }

    const post = new Post(title, contentMD, contentHTML);
    post.saveJSON();
    post.saveHTML();

    // 전체 json 파일을 읽어서 정렬한 후 조회화면 만들기
    const posts = glob
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
    console.log(posts);

    res.sendStatus(200);
});

// app.get("/api/postList", (req, res) => {
//     res.send(store.getAll());
// });

// app.get("/api/post/:id", (req, res) => {
//     if (!req.params.id) {
//         res.sendStatus(400);
//         return;
//     }
//     res.send(store.get(+req.params.id));
// });

app.listen(port, () => {
    console.log(`listening on ${port} ...`);
});
