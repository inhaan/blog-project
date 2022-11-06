import express from "express";
import path from "path";
import { Store } from "./store";

const port = 3000;
const store = new Store();

const app = express();
app.use(express.static(path.join(__dirname, "wwwroot")));
app.use(express.json());

app.post("/api/post", (req, res) => {
    const { title, content } = req.body ?? {};
    if (!title || !content) {
        res.sendStatus(400);
        return;
    }
    store.save({ title, content });
    res.sendStatus(200);
});

app.get("/api/postList", (req, res) => {
    res.send(store.getAll());
});

app.listen(port, () => {
    console.log(`listening on ${port} ...`);
});
