import pug from "pug";

import { erudit } from "src/erudit";
import { normalize, writeFile } from "src/util/io";

export default class Layout
{
    static render(src: string, view: any)
    {
        let baseDir = normalize(erudit.path.package('site/_layout'));
        let srcPath = normalize(baseDir, src);

        let pugOptions = {
            filename:   srcPath,
            basedir:    baseDir,
            cache:      !erudit.dev,
            lang:       erudit.lang.langCode,
            i18n:       (key, ...values) => erudit.lang.phrase(key, values)
        }

        return pug.renderFile(srcPath, {...pugOptions, ...view});
    }

    static compile(src: string, view: any, dest: string)
    {
        let destPath = normalize(erudit.path.site(dest));
        let html = this.render(src, view);

        writeFile(destPath, html);

        if (erudit.dev)
            writeFile(destPath + '.json', JSON.stringify(view, null, 4));
    }
}