/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*****************************************!*\
  !*** ./src/client/viewPost/viewPost.ts ***!
  \*****************************************/

document.addEventListener("DOMContentLoaded", async () => {
    const searchParam = new URLSearchParams(location.search);
    const id = searchParam.get("id");
    // const response = await fetch(`/api/post/${id}`);
    // const post = await response.json();
    const post = {
        title: "안녕하세요 반가워요~",
        contentMD: "# 안녕\n## 하세요",
        contentHTML: "<h1>안녕</h1><h2>하세요</h2>",
        date: "2022-11-08T22:32:31.672Z",
        id: "안녕하세요-반가워요~",
    };
    document.getElementById("title").textContent = post.title;
    new toastui.Editor({
        el: document.querySelector("#viewer"),
        initialValue: post.contentMD,
    });
});

/******/ })()
;
//# sourceMappingURL=viewPost.dbbfc93ef7ca959fd061.js.map