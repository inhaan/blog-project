const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const _ = require("lodash");
const { runWebpack } = require("./common");
const CreatePageHtmlPlugin = require("../webpack/plugins/CreatePageHtmlPlugin");
const CreateIndexHtmlPlugin = require("../webpack/plugins/CreateIndexHtmlPlugin");

(async () => {
    console.log("build dev start...");
    console.log("build server...");
    const result = execSync("npm run build:server");
    console.log(result.toString());

    console.log("create posts...");
    const { createPosts } = require("../dist/resolver/pageResolver");
    createPosts(path.join(__dirname, "../docs"));

    console.log("run webpack...");
    await runWebpack(path.join(__dirname, "../webpack.config.js"), getPlugins());

    console.log("create nojekyll file...");
    fs.createFileSync(path.join(__dirname, "../docs/.nojekyll"));

    console.log("build docs success");
})();

function getPlugins() {
    const plugins = [];
    const { getAllPost } = require("../dist/resolver/pageResolver");
    const allPosts = getAllPost();

    // menu/page
    const paginated = _.chunk(allPosts, 5);
    paginated.forEach((posts, idx) => {
        const page = idx + 1;
        plugins.push(new CreatePageHtmlPlugin(posts, page, paginated.length));
    });

    // index
    plugins.push(new CreateIndexHtmlPlugin(paginated[0], 1, paginated.length));
    return plugins;
}
