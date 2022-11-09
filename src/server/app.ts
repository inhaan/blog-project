import express from "express";
import path from "path";
import { createIndex } from "./pageResolver";
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

    createIndex();

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`listening on ${port} ...`);
});
