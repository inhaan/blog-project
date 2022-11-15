import path from "path";
import fs from "fs-extra";
import mustache from "mustache";
import glob from "glob";
import { slugify } from "../util/slugify";
import { dateFormat } from "../util/date";

const postsPath = path.join(__dirname, "../../posts");
const templatePath = path.join(__dirname, "../../templates");
const wwwrootPath = path.join(__dirname, "../wwwroot");
const buildTempPath = path.join(__dirname, "../../.build");

export function getPost(menu: string, dateKey: string, id: string): Post | null {
    const filePath = path.join(postsPath, menu, dateKey, id, "post.json");
    const postData = fs.readJSONSync(filePath, { throws: false });
    if (!postData) {
        return null;
    }
    return new Post(postData.title, postData.contentMD, postData.contentHTML, postData.date, postData.id);
}

export function getAllPostFilePath() {
    return glob.sync("**/*.json", {
        cwd: postsPath,
        absolute: true,
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

    get url(): string {
        return `${this.getFileDir()}/${this.id}`;
    }

    get dateString(): string {
        return dateFormat(this.date, "yyyy.MM.dd");
    }

    get dateKey(): string {
        return dateFormat(this.date, "yyMM");
    }

    saveImages() {
        // temp images
        const tempImages: string[] = [];
        for (const match of this.contentMD.matchAll(/\((temp\/img\/[^.)]+\.[^)]+)\)/g)) {
            tempImages.push(match[1]);
        }

        tempImages.forEach((tempImage) => {
            this.contentMD = this.contentMD.replaceAll(tempImage, tempImage.replace("temp/img/", `img/`));
            this.contentHTML = this.contentHTML.replaceAll(tempImage, tempImage.replace("temp/img/", `img/`));
        });

        tempImages.forEach((tempImage) => {
            const src = path.join(wwwrootPath, tempImage);
            if (fs.existsSync(src)) {
                const imageFilename = path.basename(tempImage);
                const postDest = this.getPostImagePath(postsPath, imageFilename);
                const devDest = this.getPostImagePath(wwwrootPath, imageFilename);

                fs.copySync(src, postDest, { overwrite: true });

                console.log(src);
                console.log(devDest);
                fs.copySync(src, devDest, { overwrite: true });
            }
        });
        fs.removeSync(path.join(wwwrootPath, "temp"));

        // existing images
        const images: string[] = [];
        for (const match of this.contentMD.matchAll(/\((img\/[^.)]+\.[^)]+)\)/g)) {
            images.push(match[1]);
        }
        images.forEach((image) => {
            const src = path.join(buildTempPath, image);
            if (fs.existsSync(src)) {
                const imageFilename = path.basename(image);
                const postDest = this.getPostImagePath(postsPath, imageFilename);
                const devDest = this.getPostImagePath(wwwrootPath, imageFilename);

                fs.copySync(src, postDest, { overwrite: true });
                fs.copySync(src, devDest, { overwrite: true });
            }
        });
        fs.removeSync(path.join(buildTempPath, "img"));
    }

    saveData(): void {
        fs.outputJSONSync(this.getPostFilePath(), this);
    }

    saveHTML(outPath?: string): void {
        const template = fs.readFileSync(path.join(templatePath, "common/viewPost.mustache"), "utf-8");
        const viewHTML = mustache.render(template, this);
        fs.outputFileSync(this.getPostHTMLPath(outPath), viewHTML);

        const imgPath = this.getPostImagePath(postsPath);
        if (fs.existsSync(imgPath)) {
            fs.copySync(imgPath, this.getPostImagePath(outPath));
        }
    }

    delete() {
        fs.removeSync(this.getPostDirPath(postsPath));
        fs.removeSync(this.getPostDirPath(wwwrootPath));
    }

    copyImagesToTemp() {
        const images: string[] = [];
        for (const match of this.contentMD.matchAll(/\((img\/[^.)]+\.[^)]+)\)/g)) {
            images.push(match[1]);
        }

        images.forEach((image) => {
            const src = path.join(this.getPostDirPath(postsPath), image);
            const buildTempDest = path.join(buildTempPath, image);
            fs.copySync(src, buildTempDest, { overwrite: true });
        });
    }

    private getPostDirPath(entryPath: string) {
        return path.join(entryPath, this.getFileDir(), this.id);
    }

    private getPostImagePath(entryPath = wwwrootPath, imageFileName = "") {
        return path.join(entryPath, this.getFileDir(), this.id, "img", imageFileName);
    }

    private getPostFilePath() {
        return path.join(postsPath, this.getFileDir(), this.id, "post.json");
    }

    private getPostHTMLPath(outPath = wwwrootPath) {
        return path.join(outPath, this.getFileDir(), this.id, "index.html");
    }
}
