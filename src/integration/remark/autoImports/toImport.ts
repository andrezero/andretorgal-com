import { toLinux } from '../common/path';

import type { Export } from './types';

export function toImport(exp: Export, alias: string): string {
    const { file, name, isDefault } = exp;

    return isDefault
        ? `import ${alias} from '${toLinux(file)}';`
        : `import {${name} as ${alias}} from '${toLinux(file)}'`;
}
