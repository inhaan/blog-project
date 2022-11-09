const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",
    // devtool: "source-map",
    entry: {
        // index: "./src/client/index/index.ts",
        // viewPost: "./src/client/viewPost/viewPost.ts",
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "docs"),
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
            filename: "index.html",
            template: "./.build/templates/index.html",
            chunks: [],
        }),
    ],
};
