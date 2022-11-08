const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: {
        index: "./src/client/index/index.ts",
        writePost: "./src/client/writePost/writePost.ts",
        viewPost: "./src/client/viewPost/viewPost.ts",
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist/wwwroot"),
        // clean: true,
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
            template: "./src/client/writePost/writePost.html",
            chunks: ["writePost"],
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/client/index/index.html",
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            filename: "viewPost.html",
            template: "./src/client/viewPost/viewPost.html",
            chunks: ["viewPost"],
        }),
    ],
};
