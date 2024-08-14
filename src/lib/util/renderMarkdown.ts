import { render } from '@croct/md-lite';

export default function renderMarkdown(md: string): string {
    return render(md, {
        text: node => node.content,
        bold: node => `<b>${node.children}</b>`,
        italic: node => `<i>${node.children}</i>`,
        strike: node => `<s>${node.children}</s>`,
        code: node => `<code>${node.content}</code>`,
        link: node => /https:\/\//.test(node.href) ?
            `<a href="${node.href}" target="_blank">${node.children}</a>` :
            node.children,
        image: node => `<img src="${node.src}" alt="${node.alt}">`,
        paragraph: node => `<p>${node.children.join('')}</p>`,
        fragment: node => node.children.join(''),
    });
}