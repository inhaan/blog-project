import { Post } from "./interfaces";

export class Store {
    store: Post[] = [];
    currentId: number = 1;

    save(post: Omit<Post, "id" | "date">) {
        this.store.push({ id: this.currentId++, date: new Date(), ...post });
    }

    getAll() {
        return [...this.store];
    }

    get(id: number) {
        return this.store.find((x) => x.id === id);
    }
}
