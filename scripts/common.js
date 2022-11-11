const webpack = require("webpack");

function runWebpack(configFilePath) {
    return new Promise((resolve, reject) => {
        const webpackConfig = require(configFilePath);
        webpack(webpackConfig, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports.runWebpack = runWebpack;
