document.addEventListener("DOMContentLoaded", async () => {
    const searchParam = new URLSearchParams(location.search);
    const id = searchParam.get("id");

    const response = await fetch(`/api/post/${id}`);
    const post = await response.json();

    (document.getElementById("title") as HTMLElement).textContent = post.title;
    new toastui.Editor({
        el: document.querySelector("#viewer"),
        initialValue: post.content,
    });
});
