document.addEventListener("DOMContentLoaded", async () => {
    const loadingEl = document.getElementById("loading") as HTMLElement;

    document.getElementById("container")?.addEventListener("click", async (event) => {
        const action = (event.target as any).dataset?.action;
        if (!action) {
            return;
        }

        const menu = (event.target as any).parentElement.dataset.postmenu;
        const dateKey = (event.target as any).parentElement.dataset.postdatekey;
        const id = (event.target as any).parentElement.dataset.postid;

        switch (action) {
            case "delete":
                if (confirm("삭제하시겠습니까?")) {
                    loadingEl.classList.add("show");
                    await fetch(`/api/post/${menu}/${dateKey}/${id}`, {
                        method: "DELETE",
                    });
                    window.location.reload();
                }
                break;
            case "edit":
                window.location.href = `/editPost.html?menu=${menu}&dateKey=${dateKey}&id=${id}`;
                break;
        }
    });
});
