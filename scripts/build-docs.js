const fs = require("fs-extra");
const path = require("path");
const { createIndex, createPosts } = require("../dist/pageResolver");

const docsPath = path.join(__dirname, "../docs");
createIndex(docsPath, false);
createPosts(docsPath);

fs.createFileSync(path.join(__dirname, "../docs/.nojekyll"));
