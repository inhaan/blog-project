const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const _ = require("lodash");
const { runWebpack } = require("./common");
const CreatePageHtmlPlugin = require("../webpack/plugins/CreatePageHtmlPlugin");
const CreateIndexHtmlPlugin = require("../webpack/plugins/CreateIndexHtmlPlugin");

const { pagingSize, menu: menuList } = fs.readJSONSync(path.join(__dirname, "../app.config.json"));

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

    console.log("copy static...");
    fs.copySync(path.join(__dirname, "../src/static"), path.join(__dirname, "../docs"), {
        overwrite: true,
    });

    console.log("create nojekyll file...");
    fs.createFileSync(path.join(__dirname, "../docs/.nojekyll"));

    console.log("build docs success");
})();

function getPlugins() {
    let plugins = [];
    const { getAllPost } = require("../dist/resolver/pageResolver");
    const allPosts = getAllPost();

    const menuListWithPost = [{ id: "all", name: "전체" }, ...menuList].map(({ id, name }) => {
        if (id === "all") {
            return { id, name, posts: allPosts, count: allPosts.length };
        }
        const posts = allPosts.filter((x) => x.menu === id);
        return { id, name, posts, count: posts.length };
    });

    // menu/page
    menuListWithPost.forEach(({ id, posts }) => {
        plugins = plugins.concat(makeCreatePageHtmlPlugin(id, posts, pagingSize, menuListWithPost));
    });

    // index
    const allPaginated = _.chunk(allPosts, pagingSize);
    plugins.push(new CreateIndexHtmlPlugin(allPaginated[0], 1, allPaginated.length, menuListWithPost));
    return plugins;
}

function makeCreatePageHtmlPlugin(menu, menuPosts, pagingSize, menuListWithPost) {
    const paginated = _.chunk(menuPosts, pagingSize);
    if (!paginated.length) {
        return [new CreatePageHtmlPlugin(menu, [], 1, 1, menuListWithPost)];
    }
    return paginated.reduce((plugins, posts, idx) => {
        const page = idx + 1;
        plugins.push(new CreatePageHtmlPlugin(menu, posts, page, paginated.length, menuListWithPost));
        return plugins;
    }, []);
}
