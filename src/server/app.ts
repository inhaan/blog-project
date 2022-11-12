import express from "express";
import path from "path";
import { execSync } from "child_process";
import { getPost, Post } from "./model/Post";

const port = 3000;

const app = express();
app.use(express.static(path.join(__dirname, "wwwroot")));
app.use(express.json());

app.post("/api/post", async (req, res) => {
    const { title, contentMD, contentHTML } = req.body ?? {};
    if (!title || !contentMD || !contentHTML) {
        res.sendStatus(400);
        return;
    }

    const post = new Post(title, contentMD, contentHTML);
    post.saveData();
    post.saveHTML();

    const result = execSync("npm run build:dev");
    console.log(result.toString());

    res.sendStatus(200);
});

app.put("/api/post", async (req, res) => {
    const { title, contentMD, contentHTML, menu, dateKey, id } = req.body ?? {};
    if (!title || !contentMD || !contentHTML || !menu || !dateKey || !id) {
        res.sendStatus(400);
        return;
    }
    const prePost = getPost(menu, dateKey, id);
    if (!prePost) {
        res.sendStatus(400);
        return;
    }
    prePost.delete();

    const post = new Post(title, contentMD, contentHTML, prePost.date);
    post.saveData();
    post.saveHTML();

    const result = execSync("npm run build:dev");
    console.log(result.toString());

    res.sendStatus(200);
});

app.delete("/api/post/:menu/:dateKey/:id", async (req, res) => {
    const { menu, dateKey, id } = req.params;
    if (!menu || !dateKey || !id) {
        res.sendStatus(400);
        return;
    }

    const post = getPost(menu, dateKey, id);
    if (!post) {
        res.sendStatus(400);
        return;
    }

    post.delete();

    const result = execSync("npm run build:dev");
    console.log(result.toString());

    res.sendStatus(200);
});

app.get("/api/post/:menu/:dateKey/:id", (req, res) => {
    const { menu, dateKey, id } = req.params;
    if (!menu || !dateKey || !id) {
        res.sendStatus(400);
        return;
    }

    const post = getPost(menu, dateKey, id);
    if (!post) {
        res.sendStatus(400);
        return;
    }

    res.send(Object.assign({ dateString: post.dateString }, post));
});

app.listen(port, () => {
    console.log(`listening on ${port} ...`);
});
