const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const { runWebpack } = require("./common");

(async () => {
    console.log("build dev start...");
    console.log("build server...");
    const result = execSync("npm run build:server");
    console.log(result.toString());

    console.log("create posts...");
    const { createPosts } = require("../dist/resolver/pageResolver");
    createPosts(path.join(__dirname, "../dist/wwwroot"));

    console.log("run webpack...");
    await runWebpack(path.join(__dirname, "../webpack.config.dev.js"));

    console.log("build dev success");
})();
