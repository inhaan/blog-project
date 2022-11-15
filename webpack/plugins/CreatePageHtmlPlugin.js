const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs-extra");
const mustache = require("mustache");

module.exports = class CreatePageHtmlPlugin extends HtmlWebpackPlugin {
    constructor(menu, posts, page, totalPage, menuList, isDev = false) {
        const dir = isDev ? "dev" : "prod";
        const pageNumbers = [];
        for (let i = 1; i <= totalPage; i++) {
            pageNumbers.push({ num: i, active: i === page });
        }

        const options = {
            filename: `${menu}/page/${page}/index.html`,
            templateContent: () => {
                const template = fs.readFileSync(
                    path.join(__dirname, `../../templates/${dir}/page.mustache`),
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
