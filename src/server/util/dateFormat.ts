export function dateFormat(date: Date, format: string): string {
    let result = format;
    result = result.replaceAll(/yyyy/g, date.getFullYear().toString());
    result = result.replaceAll(/yy/g, date.getFullYear().toString().slice(2, 4));
    result = result.replaceAll(/MM/g, (date.getMonth() + 1).toString().padStart(2, "0"));
    result = result.replaceAll(/dd/g, date.getDate().toString().padStart(2, "0"));

    return result;
}
