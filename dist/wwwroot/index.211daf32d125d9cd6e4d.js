/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!***********************************!*\
  !*** ./src/client/index/index.ts ***!
  \***********************************/

document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/api/postList");
    const posts = await response.json();
    const postContainerEl = document.getElementById("postContainer");
    posts.forEach((post) => {
        const itemEl = document.createElement("li");
        itemEl.innerHTML = `<div><a href="/viewPost.html?id=${post.id}"> ${post.title}</a></div><div>${post.date}</div>`;
        postContainerEl.append(itemEl);
    });
});

/******/ })()
;
//# sourceMappingURL=index.211daf32d125d9cd6e4d.js.map