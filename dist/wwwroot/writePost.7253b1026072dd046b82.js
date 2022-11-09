/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!*******************************************!*\
  !*** ./src/client/writePost/writePost.ts ***!
  \*******************************************/

const editor = new toastui.Editor({
    el: document.querySelector("#editor"),
    previewStyle: "vertical",
});
document.getElementById("btnSave")?.addEventListener("click", async () => {
    const title = document.querySelector("input[name='title']").value;
    const contentMD = editor.getMarkdown();
    const contentHTML = editor.getHTML();
    if (!title) {
        alert("제목을 입력해 주세요");
        return;
    }
    if (!contentMD || !contentHTML) {
        alert("내용을 입력해 주세요");
        return;
    }
    await fetch("/api/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, contentMD, contentHTML }),
    });
    alert("저장했습니다");
    window.location.href = "/";
});

/******/ })()
;
//# sourceMappingURL=writePost.7253b1026072dd046b82.js.map