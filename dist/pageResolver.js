"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndex = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const glob_1 = __importDefault(require("glob"));
const mustache_1 = __importDefault(require("mustache"));
const path_1 = __importDefault(require("path"));
const Post_1 = require("./Post");
function createIndex() {
    const posts = getAllPost();
    const template = fs_extra_1.default.readFileSync(path_1.default.join(__dirname, "../templates/index.mustache"), "utf-8");
    const indexHTML = mustache_1.default.render(template, { posts });
    fs_extra_1.default.outputFileSync(path_1.default.join(__dirname, "wwwroot/index.html"), indexHTML);
}
exports.createIndex = createIndex;
function getAllPost() {
    return glob_1.default
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
}
//# sourceMappingURL=pageResolver.js.map