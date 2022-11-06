const editor = new toastui.Editor({
    el: document.querySelector("#editor"),
    previewStyle: "vertical",
});

document.getElementById("btnSave")?.addEventListener("click", async () => {
    const title = (document.querySelector("input[name='title']") as HTMLInputElement).value;
    const content = editor.getMarkdown();

    if (!title) {
        alert("제목을 입력해 주세요");
        return;
    }
    if (!content) {
        alert("내용을 입려해 주세요");
        return;
    }

    await fetch("/api/post", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
    });

    alert("저장했습니다");
});
