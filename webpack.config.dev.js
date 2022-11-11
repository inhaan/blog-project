const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BuildServerPlugin = require("./webpack/plugins/BuildServerPlugin");
const CreateIndexHtmlPlugin = require("./webpack/plugins/CreateIndexHtmlPlugin");

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
        new BuildServerPlugin(),
        new CreateIndexHtmlPlugin(true),
        new HtmlWebpackPlugin({
            filename: "writePost.html",
            template: "./src/client/writePost/writePost.html",
            chunks: ["writePost"],
        }),
        new HtmlWebpackPlugin({
            filename: "editPost.html",
            template: "./src/client/editPost/editPost.html",
            chunks: ["editPost"],
        }),
    ],
};
