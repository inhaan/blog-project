const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {},
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "docs"),
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
            filename: "about/index.html",
            template: "src/client/about/about.html",
            chunks: [],
        }),
    ],
};
