const path = require("path");

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
    plugins: [],
};
