const path = require("path");
const fs = require("fs-extra");
const mustache = require("mustache");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: {
        index: "./src/client/index/index.ts",
        writePost: "./src/client/writePost/writePost.ts",
        editPost: "./src/client/editPost/editPost.ts",
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist/wwwroot"),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "writePost.html",
            templateContent: () => {
                const template = fs.readFileSync(
                    path.join(__dirname, `templates/dev/writePost.mustache`),
                    "utf-8"
                );
                const { menu } = fs.readJSONSync(path.join(__dirname, "app.config.json"));
                return mustache.render(template, { menu });
            },
            chunks: ["writePost"],
        }),
        new HtmlWebpackPlugin({
            filename: "editPost.html",
            templateContent: () => {
                const template = fs.readFileSync(path.join(__dirname, `templates/dev/editPost.mustache`), "utf-8");
                const { menu } = fs.readJSONSync(path.join(__dirname, "app.config.json"));
                return mustache.render(template, { menu });
            },
            chunks: ["editPost"],
        }),
        new HtmlWebpackPlugin({
            filename: "about/index.html",
            template: "src/client/about/about.html",
            chunks: [],
        }),
    ],
};
