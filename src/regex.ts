export function cutGroup1(regex: string, text: string): string | null {
    const myRegexp = new RegExp(regex);
    const match = myRegexp.exec(text);
    return match? match[1] : null;
}