/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*****************************************!*\
  !*** ./src/client/viewPost/viewPost.ts ***!
  \*****************************************/

document.addEventListener("DOMContentLoaded", async () => {
    const searchParam = new URLSearchParams(location.search);
    const id = searchParam.get("id");
    const response = await fetch(`/api/post/${id}`);
    const post = await response.json();
    document.getElementById("title").textContent = post.title;
    new toastui.Editor({
        el: document.querySelector("#viewer"),
        initialValue: post.content,
    });
});

/******/ })()
;
//# sourceMappingURL=viewPost.f78c9bf97644af839a75.js.map