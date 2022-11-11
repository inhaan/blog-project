const path = require("path");
const BuildServerPlugin = require("./webpack/plugins/BuildServerPlugin");
const CreateIndexHtmlPlugin = require("./webpack/plugins/CreateIndexHtmlPlugin");

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
        new BuildServerPlugin(), //
        new CreateIndexHtmlPlugin(),
    ],
};
