const fs = require("fs-extra");
const path = require("path");
const { exec, execSync } = require("child_process");
const _ = require("lodash");

const builder = _.debounce((event, filename) => {
    console.log(`${event}: ${filename}`);

    console.log("running build dev ...");
    const result = execSync("npm run build:dev");
    console.log(result.toString());
    console.log("complete build dev");
}, 100);

execute("nodemon", "npx nodemon dist/app.js");

startWatch("../src");
startWatch("../templates");

function startWatch(target) {
    console.log(`start to watch: ${target}`);
    fs.watch(path.join(__dirname, target), { recursive: true }, builder);
}

function execute(name, command) {
    const childProcess = exec(command);
    childProcess.stdout.on("data", (data) => {
        console.log(`${name}: ${data}`);
    });
    childProcess.stderr.on("data", (data) => {
        console.log(`${name}: ${data}`);
    });
    childProcess.on("exit", (data) => {
        console.log(`${name}: ${data}`);
    });
}
