import type { Root } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

import type { RemarkPlugin } from '../types/RemarkPlugin';
import type { VFile } from '../types/VFile';

type Url = {
    url: string;
    label: string;
};

type Urls = {
    internal: Url[];
    external: Url[];
};

type LinkNode = {
    tagName: string;
    properties?: {
        href?: string;
        rel?: string;
        'data-external'?: string;
        'data-type'?: string | undefined;
    };
};

export function collectAndDecorateLinks(): RemarkPlugin {
    return function (tree: Root, file: VFile): void {
        const urls: Urls = { internal: [], external: [] };

        visit(tree, 'element', (node: LinkNode) => {
            if (
                node.tagName === 'a' &&
                node.properties &&
                typeof node.properties.href === 'string'
            ) {
                const url = node.properties.href;
                const label = toString(node);
                const isAbsolute = /^[a-z]+:/.test(url) || url.startsWith('//');
                if (isAbsolute) {
                    node.properties.rel = 'noopener';
                    node.properties['data-external'] = '';
                    urls.external.push({ url, label });
                } else {
                    const base = url.split('/')[1];
                    node.properties['data-type'] = base;
                    urls.internal.push({ url, label });
                }
            }
        });

        const { frontmatter } = file.data.astro;
        frontmatter.urls = urls;
    };
}
