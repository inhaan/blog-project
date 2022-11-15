export function changeImageUrlForEdit(contentMD: string, url: string) {
    const images: string[] = [];
    for (const match of contentMD.matchAll(/\((img\/[^.)]+\.[^)]+)\)/g)) {
        images.push(match[1]);
    }

    let result = contentMD;
    images.forEach((image) => {
        result = result.replaceAll(image, image.replace("img/", `${url}/img/`));
    });
    return result;
}

export function restoreImageUrlForEdit(contentMD: string, contentHTML: string, url: string) {
    const images: string[] = [];
    const pattern = new RegExp(`\\((${url}\\/img\\/[^.)]+\\.[^)]+)\\)`, "g");
    for (const match of contentMD.matchAll(pattern)) {
        images.push(match[1]);
    }

    let result = { contentMD, contentHTML };
    images.forEach((image) => {
        result.contentMD = result.contentMD.replaceAll(image, image.replace(`${url}/`, ""));
        result.contentHTML = result.contentHTML.replaceAll(image, image.replace(`${url}/`, ""));
    });
    return result;
}
