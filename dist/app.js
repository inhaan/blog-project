"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const glob_1 = __importDefault(require("glob"));
const Post_1 = require("./Post");
const port = 3000;
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, "wwwroot")));
app.use(express_1.default.json());
app.post("/api/post", (req, res) => {
    const { title, contentMD, contentHTML } = req.body ?? {};
    if (!title || !contentMD || !contentHTML) {
        res.sendStatus(400);
        return;
    }
    const post = new Post_1.Post(title, contentMD, contentHTML);
    post.saveJSON();
    post.saveHTML();
    // 전체 json 파일을 읽어서 정렬한 후 조회화면 만들기
    const posts = glob_1.default
        .sync("posts/**/*.json", {
        cwd: path_1.default.join(__dirname, ".."),
    })
        .map((filePath) => {
        const { title, contentMD, contentHTML, date, id } = fs_extra_1.default.readJSONSync(filePath);
        return new Post_1.Post(title, contentMD, contentHTML, date, id);
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
//# sourceMappingURL=app.js.map