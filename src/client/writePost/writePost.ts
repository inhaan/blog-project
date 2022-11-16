{
    const titleEl = document.querySelector("input[name='title']") as HTMLInputElement;
    const menuEl = document.querySelector("select[name='menu']") as HTMLSelectElement;
    const loadingEl = document.getElementById("loading") as HTMLElement;

    const editor = new toastui.Editor({
        el: document.querySelector("#editor"),
        previewStyle: "vertical",
        height: "600px",
        plugins: [toastui.Editor.plugin.codeSyntaxHighlight],
        hooks: {
            async addImageBlobHook(blob: Blob, callback: (url: string, text?: string) => void) {
                if (blob.size >= 50 * 1024 * 1024) {
                    alert("파일이 50MB를 초과하였습니다");
                    return;
                }

                const form = new FormData();
                form.append("image", blob);
                const response = await fetch(`/api/tempImage`, {
                    method: "POST",
                    body: form,
                });
                const url = await response.text();

                callback(url);
            },
        },
    });

    document.getElementById("btnSave")?.addEventListener("click", async () => {
        const menu = menuEl.value;
        const title = titleEl.value;
        const contentMD = editor.getMarkdown();
        const contentHTML = editor.getHTML();

        if (!menu) {
            alert("카테고리를 선택해 주세요");
            return;
        }
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
            body: JSON.stringify({ menu, title, contentMD, contentHTML }),
        });

        alert("저장했습니다");
        window.location.href = document.referrer;
    });
}
