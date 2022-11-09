const { createIndex, createPosts } = require("../dist/pageResolver");

(async () => {
    await createIndex();
    createPosts();
})();
