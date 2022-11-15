import fs from "fs-extra";
import path from "path";

interface AppConfig {
    pagingSize: number;
    menu: Menu[];
}

interface Menu {
    id: string;
    name: string;
}

let _config: AppConfig;
export function getAppConfig() {
    if (!_config) {
        _config = fs.readJSONSync(path.join(__dirname, "../../app.config.json"));
    }
    return _config;
}
