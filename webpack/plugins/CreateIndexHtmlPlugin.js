const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs-extra");
const mustache = require("mustache");

module.exports = class CreateIndexHtmlPlugin extends HtmlWebpackPlugin {
    constructor(posts, page, totalPage, menuList, isDev = false) {
        const dir = isDev ? "dev" : "prod";
        const pageNumbers = [];
        for (let i = 1; i <= totalPage; i++) {
            pageNumbers.push({ num: i, active: i === page });
        }

        menuList = menuList.map((x) => {
            return {
                ...x,
                className: x.id === "all" ? "active" : "",
            };
        });

        const options = {
            filename: "index.html",
            templateContent: () => {
                const template = fs.readFileSync(
                    path.join(__dirname, `../../templates/${dir}/index.mustache`),
                    "utf-8"
                );

                return mustache.render(template, {
                    posts,
                    pageNumbers,
                    usePaging: pageNumbers.length > 1,
                    menuList,
                });
            },
            chunks: isDev ? ["index"] : [],
        };
        super(options);
    }
};
