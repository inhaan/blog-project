import express from "express";
import path from "path";
import { execSync } from "child_process";
import { getPost, Post } from "./model/Post";
import { getMulter } from "./middleware/multer";
import { changeImageUrlForEdit, restoreImageUrlForEdit } from "./resolver/imageResolver";

const port = 3000;

const app = express();
app.use(express.static(path.join(__dirname, "wwwroot")));
app.use(express.json());

// 글 저장
app.post("/api/post", async (req, res) => {
    let { title, contentMD, contentHTML } = req.body ?? {};
    if (!title || !contentMD || !contentHTML) {
        res.sendStatus(400);
        return;
    }

    const post = new Post(title, contentMD, contentHTML);
    post.saveImages();
    post.saveData();
    post.saveHTML();

    const result = execSync("npm run build:dev");
    console.log(result.toString());

    res.sendStatus(200);
});

// 글 수정
app.put("/api/post", async (req, res) => {
    let { title, contentMD, contentHTML, menu, dateKey, id } = req.body ?? {};
    if (!title || !contentMD || !contentHTML || !menu || !dateKey || !id) {
        res.sendStatus(400);
        return;
    }
    const prePost = getPost(menu, dateKey, id);
    if (!prePost) {
        res.sendStatus(400);
        return;
    }

    prePost.copyImagesToTemp();
    prePost.delete();

    const restored = restoreImageUrlForEdit(contentMD, contentHTML, prePost.url);
    const post = new Post(title, restored.contentMD, restored.contentHTML, prePost.date);
    post.saveImages();
    post.saveData();
    post.saveHTML();

    const result = execSync("npm run build:dev");
    console.log(result.toString());

    res.sendStatus(200);
});

// 글 삭제
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

// 글 조회
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

    res.send({
        title: post.title,
        contentMD: changeImageUrlForEdit(post.contentMD, post.url),
        dateString: post.dateString,
    });
});

// 이미지 임시 저장
const upload = getMulter();
app.post("/api/tempImage", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.sendStatus(400);
        return;
    }
    const url = path.relative(path.join(__dirname, "wwwroot"), req.file.path).replaceAll("\\", "/");
    res.send(url);
});

app.listen(port, () => {
    console.log(`listening on ${port} ...`);
});
