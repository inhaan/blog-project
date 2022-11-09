import path from "path";
import fs from "fs-extra";
import mustache from "mustache";
import glob from "glob";
import { slugify } from "./slugify";
import { dateFormat } from "./dateFormat";

export function getPost(menu: string, dateKey: string, id: string): Post | null {
    const filePath = path.join(__dirname, "../posts", menu, dateKey, `${id}.json`);
    const postData = fs.readJSONSync(filePath, { throws: false });
    if (!postData) {
        return null;
    }
    return new Post(
        postData.title,
        postData.contentMD,
        postData.contentHTML,
        postData.date,
        postData.id
    );
}

export function getPostAll() {
    return glob.sync("posts/**/*.json", {
        cwd: path.join(__dirname, ".."),
    });
}

export class Post {
    id: string;
    date: Date;
    menu = "etc";

    constructor(
        public title: string,
        public contentMD: string,
        public contentHTML: string,
        date: Date | string = new Date(),
        id?: string
    ) {
        this.id = id ?? slugify(title);

        if (typeof date === "string") {
            date = new Date(date);
        }
        this.date = date;
    }

    private getFileDir(): string {
        return `${this.menu}/${this.dateKey}`;
    }

    private getFileName(ext?: string): string {
        return `${this.id}${ext ?? ""}`;
    }

    get url(): string {
        return `${this.getFileDir()}/${this.getFileName()}`;
    }

    get devUrl(): string {
        return `${this.getFileDir()}/${this.getFileName(".html")}`;
    }

    get dateString(): string {
        return dateFormat(this.date, "yyyy.MM.dd");
    }

    get dateKey(): string {
        return dateFormat(this.date, "yyMM");
    }

    saveData(): void {
        fs.outputJSONSync(this.getPostFilePath(), this);
    }

    saveHTML(outPath?: string): void {
        const template = fs.readFileSync(
            path.join(__dirname, "../templates/viewPost.mustache"),
            "utf-8"
        );
        const viewHTML = mustache.render(template, this);
        fs.outputFileSync(this.getPostHTMLPath(outPath), viewHTML);
    }

    delete(outPath?: string) {
        fs.rmSync(this.getPostFilePath(), { force: true });
        fs.rmSync(this.getPostHTMLPath(outPath), { force: true });
    }

    private getPostFilePath() {
        return path.join(__dirname, "../posts", this.getFileDir(), this.getFileName(".json"));
    }

    private getPostHTMLPath(outPath?: string) {
        outPath = outPath ?? path.join(__dirname, "wwwroot");
        return path.join(outPath, this.getFileDir(), this.getFileName(".html"));
    }
}
