const glob = require("glob");
const path = require("path");
const fs = require("fs-extra");

function getAllPost() {
    return getAllPostFilePath()
        .map((filePath) => {
            const { title, contentMD, contentHTML, date, id } = fs.readJSONSync(filePath);
            return new Post(title, contentMD, contentHTML, date, id);
        })
        .sort((a, b) => {
            return b.date.getTime() - a.date.getTime();
        });
}

function getAllPostFilePath() {
    return glob.sync("posts/**/*.json", {
        cwd: path.join(__dirname, ".."),
    });
}

function createPosts(outPath) {
    const posts = getAllPost();
    posts.forEach((post) => {
        post.saveHTML(outPath);
    });
}

export class Post {
    menu = "etc";

    constructor(title, contentMD, contentHTML, date = new Date(), id) {
        this.title = title;
        this.contentMD = contentMD;
        this.contentHTML = contentHTML;
        this.id = id ?? slugify(title);
        if (typeof date === "string") {
            date = new Date(date);
        }
        this.date = date;
        this.url = `${this.getFileDir()}/${this.getFileName()}`;
        this.devUrl = `${this.getFileDir()}/${this.getFileName(".html")}`;
        this.dateString = dateFormat(this.date, "yyyy.MM.dd");
        this.dateKey = dateFormat(this.date, "yyMM");
    }

    getFileDir() {
        return `${this.menu}/${this.dateKey}`;
    }

    getFileName(ext) {
        return `${this.id}${ext ?? ""}`;
    }

    saveData() {
        fs.outputJSONSync(this.getPostFilePath(), this);
    }

    saveHTML(outPath) {
        const template = fs.readFileSync(
            path.join(__dirname, "../templates/common/viewPost.mustache"),
            "utf-8"
        );
        const viewHTML = mustache.render(template, this);
        fs.outputFileSync(this.getPostHTMLPath(outPath), viewHTML);
    }

    delete(outPath) {
        fs.rmSync(this.getPostFilePath(), { force: true });
        fs.rmSync(this.getPostHTMLPath(outPath), { force: true });
    }

    getPostFilePath() {
        return path.join(__dirname, "../posts", this.getFileDir(), this.getFileName(".json"));
    }

    getPostHTMLPath(outPath) {
        outPath = outPath ?? path.join(__dirname, "wwwroot");
        return path.join(outPath, this.getFileDir(), this.getFileName(".html"));
    }
}

module.exports.getAllPost = getAllPost;
