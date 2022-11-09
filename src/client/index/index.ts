document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("container")?.parentElement;

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
                await fetch(`/api/post/${menu}/${dateKey}/${id}`, {
                    method: "DELETE",
                });
                window.location.reload();
                break;
            case "edit":
                break;
        }
    });
});
