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
    createPosts(path.join(__dirname, "../docs"));

    console.log("run webpack...");
    await runWebpack(path.join(__dirname, "../webpack.config.js"));

    console.log("create nojekyll file...");
    fs.createFileSync(path.join(__dirname, "../docs/.nojekyll"));

    console.log("build docs success");
})();
