/** Converts the catalog's list representation into one editable rich list. */
export function requirementsToHtml(requirements: string[]): string {
    return `<ul>${requirements.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

/** Converts editor HTML back into one safely-storable HTML fragment per requirement. */
export function htmlToRequirements(html: string): string[] {
    const document = new DOMParser().parseFromString(html, 'text/html');
    const listItems = Array.from(document.body.querySelectorAll('li'));

    if (listItems.length) {
        return listItems.map((item) => item.innerHTML.trim()).filter(Boolean);
    }

    // If the user removes the list formatting, treat each block or line break
    // as a requirement so their text is never discarded.
    const blocks = Array.from(document.body.children)
        .map((element) => element.innerHTML.trim())
        .filter(Boolean);

    if (blocks.length) return blocks;

    return (document.body.innerHTML || '')
        .split(/<br\s*\/?>/i)
        .map((line) => line.trim())
        .filter(Boolean);
}
