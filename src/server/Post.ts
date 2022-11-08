import path from "path";
import fs from "fs-extra";
import mustache from "mustache";
import { slugify } from "./slugify";

export class Post {
    id: string;
    date: Date;

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
        const menu = "etc";
        const yy = new Date().getFullYear().toString().slice(2, 4);
        const MM = (new Date().getMonth() + 1).toString().padStart(2, "0");
        return path.join(menu, `${yy}${MM}`);
    }

    private getFileName(ext: string): string {
        return `${this.id}${ext}`;
    }

    saveJSON(): void {
        fs.outputJSONSync(
            path.join(__dirname, "../posts", this.getFileDir(), this.getFileName(".json")),
            this
        );
    }

    saveHTML(): void {
        const template = fs.readFileSync(
            path.join(__dirname, "../templates/viewPost.mustache"),
            "utf-8"
        );
        const viewHTML = mustache.render(template, this);
        fs.outputFileSync(
            path.join(__dirname, "wwwroot", this.getFileDir(), this.getFileName(".html")),
            viewHTML
        );
    }
}
