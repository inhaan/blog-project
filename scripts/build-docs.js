const fs = require("fs-extra");
const path = require("path");
const { runWebpack } = require("./common");

(async () => {
    console.log("run webpack...");
    await runWebpack(path.join(__dirname, "../webpack.config.js"));

    console.log("create posts...");
    const { createPosts } = require("../dist/pageResolver");
    createPosts(path.join(__dirname, "../docs"));

    console.log("create nojekyll file...");
    fs.createFileSync(path.join(__dirname, "../docs/.nojekyll"));

    console.log("build success");
})();
