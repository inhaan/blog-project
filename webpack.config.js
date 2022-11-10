const ts = require("typescript");
const path = require("path");
const fs = require("fs-extra");
const mustache = require("mustache");
const glob = require("glob");
const WebpackBeforeBuildPlugin = require("before-build-webpack");
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
        // TODO 서버 빌드 플러그인 직접 개발
        new WebpackBeforeBuildPlugin((stats, callback) => {
            // tsc 그냥 cmd로 npm run 실행하기... api로 잘 안됨
            console.log("before...");
            const tsconfig = fs.readJSONSync(path.join(__dirname, "src/server/tsconfig.json"));
            const tsFiles = glob.sync("**/*.ts", {
                cwd: path.join(__dirname, "src/server"),
                absolute: true,
            });
            console.log(tsconfig);
            console.log(tsFiles);

            const program = ts.createProgram(tsFiles, tsconfig.compilerOptions);
            const emitResult = program.emit();

            let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

            allDiagnostics.forEach((diagnostic) => {
                if (diagnostic.file) {
                    let { line, character } = ts.getLineAndCharacterOfPosition(
                        diagnostic.file,
                        diagnostic.start
                    );
                    let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                    console.log(
                        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
                    );
                } else {
                    console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
                }
            });

            callback();
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            templateContent: ({ htmlWebpackPlugin }) => {
                const { getAllPost } = require("./dist/pageResolver");
                const posts = getAllPost();
                const template = fs.readFileSync(
                    path.join(__dirname, `templates/prod/index.mustache`),
                    "utf-8"
                );
                return mustache.render(template, {
                    posts,
                    headTags: htmlWebpackPlugin.tags.headTags,
                    bodyTags: htmlWebpackPlugin.tags.bodyTags,
                });
            },
            chunks: [],
        }),
    ],
};
