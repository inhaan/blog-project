document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const menu = params.get("menu");
    const dateKey = params.get("dateKey");
    const id = params.get("id");
    if (!menu || !dateKey || !id) {
        alert("글이 존재하지 않습니다");
        window.location.href = "/";
        return;
    }

    const response = await fetch(`/api/post/${menu}/${dateKey}/${id}`);
    const { title, contentMD, dateString } = await response.json();

    const titleEl = document.getElementById("title") as HTMLInputElement;
    const dateEl = document.getElementById("date") as HTMLElement;
    const loadingEl = document.getElementById("loading") as HTMLElement;
    titleEl.value = title;
    dateEl.textContent = dateString;

    const editor = new toastui.Editor({
        el: document.querySelector("#editor"),
        previewStyle: "vertical",
        initialValue: contentMD,
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
        const title = titleEl.value;
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
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, contentMD, contentHTML, menu, dateKey, id }),
        });

        alert("저장했습니다");
        window.location.href = document.referrer;
    });
});
