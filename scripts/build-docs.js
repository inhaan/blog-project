const fs = require("fs-extra");
const path = require("path");
const { createIndex, createPosts } = require("../dist/pageResolver");

(async () => {
    const docsPath = path.join(__dirname, "../docs");
    await createIndex(false);
    createPosts(docsPath);

    fs.createFileSync(path.join(__dirname, "../docs/.nojekyll"));
})();
