interface Post {
    id: number;
    title: string;
    date: Date;
    content: string;
}

document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/api/postList");
    const posts: Post[] = await response.json();

    const postContainerEl = document.getElementById("postContainer") as HTMLElement;

    posts.forEach((post) => {
        const itemEl = document.createElement("li");
        itemEl.innerHTML = `<div><a href="/viewPost.html?id=${post.id}"> ${post.title}</a></div><div>${post.date}</div>`;
        postContainerEl.append(itemEl);
    });
});
