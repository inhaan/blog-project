"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const pageResolver_1 = require("./pageResolver");
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
    (0, pageResolver_1.createIndex)();
    res.sendStatus(200);
});
app.listen(port, () => {
    console.log(`listening on ${port} ...`);
});
//# sourceMappingURL=app.js.map