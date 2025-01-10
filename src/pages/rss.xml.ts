import { type BaseNode, fetchAllPosts } from '@content/index';
import escapeHTML from 'escape-html';
import sanitizeHtml from 'sanitize-html';

import { SITE_OG_IMAGE } from '~/config';
import { type ATOM, absolute, atomXml } from '~/utils/atomXML';

const nodeToAtom = (node: BaseNode): ATOM => {
    const { title, published, abstract, tags } = node;
    const date = new Date(published);

    // WIP
    const ogImage = SITE_OG_IMAGE;

    return {
        title,
        link: absolute(node.url),
        date,
        description: sanitizeHtml(escapeHTML(abstract?.text || '')),
        image: sanitizeHtml(ogImage),
        tags: tags || [],
    };
};

export async function get(): Promise<{
    body: string;
}> {
    const allNodes = await fetchAllPosts();
    const items: ATOM[] = allNodes.map(nodeToAtom);
    const body = atomXml(items);

    return { body };
}
