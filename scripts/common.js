const webpack = require("webpack");

function runWebpack(configFilePath, plugins) {
    return new Promise((resolve, reject) => {
        const webpackConfig = require(configFilePath);
        if (plugins) {
            webpackConfig.plugins = (webpackConfig.plugins ?? []).concat(plugins);
        }

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
