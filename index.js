import { posix as path } from 'path';

function getAlias(moduleSpecifier, aliases) {
    const longestMatchingKey = Object.keys(aliases).reduce((matchingKey, key) => {
        if(moduleSpecifier.startsWith(key)) {
            if(key.length > matchingKey.length) {
                matchingKey = key;
            }
        }
        return matchingKey;
    }, '');
    if(longestMatchingKey !== '') {
        return path.resolve(moduleSpecifier.replace(longestMatchingKey, aliases[longestMatchingKey]));
    }
}

export default function aliasModuleSpecifier(aliases) {
    return {
        name: 'alias-module-specifier',
        resolveId(importee, importer) {
            const currentDir = importer ? path.dirname(importer) : path.resolve();
            const alias = getAlias(importee, aliases);
            if(alias) {
                return path.resolve(currentDir, alias);
            }
            return null;
        }
    };
}