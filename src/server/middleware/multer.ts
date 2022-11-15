import multer from "multer";
import path from "path";
import fs from "fs-extra";

export function getMulter() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const imgPath = path.join(__dirname, "../wwwroot/temp/img");
            fs.ensureDirSync(imgPath);
            cb(null, imgPath);
        },
        filename: function (req, file, cb) {
            const parsed = path.parse(file.originalname);
            const filename = `${parsed.name}-${Date.now()}${parsed.ext}`;
            cb(null, filename);
        },
    });
    return multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });
}
