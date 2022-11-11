const { execSync } = require("child_process");
const path = require("path");

module.exports = class BuildServerPlugin {
    apply(compiler) {
        compiler.hooks.run.tapAsync({ name: "build-server-plugin" }, (tap, callback) => {
            console.log("build server...");
            const result = execSync("npm run build:server");
            console.log(result.toString());
            callback();
        });
    }
};
