{
    const editor = new toastui.Editor({
        el: document.querySelector("#editor"),
        previewStyle: "vertical",
    });

    const loadingEl = document.getElementById("loading") as HTMLElement;

    document.getElementById("btnSave")?.addEventListener("click", async () => {
        const title = (document.querySelector("input[name='title']") as HTMLInputElement).value;
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

        loadingEl.classList.add("show");
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
}
