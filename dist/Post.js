"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const mustache_1 = __importDefault(require("mustache"));
const slugify_1 = require("./slugify");
class Post {
    title;
    contentMD;
    contentHTML;
    id;
    date;
    menu = "etc";
    constructor(title, contentMD, contentHTML, date = new Date(), id) {
        this.title = title;
        this.contentMD = contentMD;
        this.contentHTML = contentHTML;
        this.id = id ?? (0, slugify_1.slugify)(title);
        if (typeof date === "string") {
            date = new Date(date);
        }
        this.date = date;
    }
    getFileDir() {
        const yy = new Date().getFullYear().toString().slice(2, 4);
        const MM = (new Date().getMonth() + 1).toString().padStart(2, "0");
        return `${this.menu}/${yy}${MM}`;
    }
    getFileName(ext) {
        return `${this.id}${ext}`;
    }
    get url() {
        return `/${this.getFileDir()}/${this.getFileName(".html")}`;
    }
    saveJSON() {
        fs_extra_1.default.outputJSONSync(path_1.default.join(__dirname, "../posts", this.getFileDir(), this.getFileName(".json")), this);
    }
    saveHTML() {
        const template = fs_extra_1.default.readFileSync(path_1.default.join(__dirname, "../templates/viewPost.mustache"), "utf-8");
        const viewHTML = mustache_1.default.render(template, this);
        fs_extra_1.default.outputFileSync(path_1.default.join(__dirname, "wwwroot", this.getFileDir(), this.getFileName(".html")), viewHTML);
    }
}
exports.Post = Post;
//# sourceMappingURL=Post.js.map