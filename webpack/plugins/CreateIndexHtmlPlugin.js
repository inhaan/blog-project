const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs-extra");
const mustache = require("mustache");

module.exports = class CreateIndexHtmlPlugin extends HtmlWebpackPlugin {
    constructor(isDev = false) {
        const dir = isDev ? "dev" : "prod";
        const options = {
            filename: "index.html",
            templateContent: ({ htmlWebpackPlugin }) => {
                const { getAllPost } = require("../../dist/pageResolver");
                const posts = getAllPost();
                const template = fs.readFileSync(
                    path.join(__dirname, `../../templates/${dir}/index.mustache`),
                    "utf-8"
                );

                return mustache.render(template, {
                    posts,
                    headTags: htmlWebpackPlugin.tags.headTags,
                    bodyTags: htmlWebpackPlugin.tags.bodyTags,
                });
            },
            chunks: [],
        };
        super(options);
    }
};
