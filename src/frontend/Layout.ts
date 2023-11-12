import pug from "pug";
import { CONFIG } from "src/config";

import { erudit } from "src/erudit";
import { link } from "src/router";
import { normalize, writeFile } from "src/util/io";

export default class Layout
{
    static getPugOptions()
    {
        return {
            basedir:    normalize(erudit.path.package('site/_layout')),
            compileDebug: CONFIG.dev,
            //cache:      !erudit.dev,
            lang:       erudit.lang.langCode,
            link:       link,
            i18n:       (key, ...values) => erudit.lang.phrase(key, values),
            topicIcon:  topicType => {
                if (topicType === 'article')
                    return 'file-lines';

                return 'topic-' + topicType;
            }
        }
    }

    static render(str: string, view: any = {}, options = this.getPugOptions())
    {
        return pug.render(str, {...options, ...view});
    }

    static renderFile(srcPath: string, view: any = {}, options = this.getPugOptions())
    {
        srcPath = this.normalizeLayoutPath(srcPath);
        return pug.renderFile(srcPath, {...options, ...view});
    }

    static compileFile(srcPath: string, destPath: string, view: any = {}, options = this.getPugOptions())
    {
        destPath = normalize(erudit.path.site(destPath));
        let html = this.renderFile(srcPath, view, options);

        writeFile(destPath, html);

        if (erudit.dev)
            writeFile(destPath + '.json', JSON.stringify(view, null, 4));
    }

    static compileFileClient(layout: string)
    {
        return pug.compileFileClient(this.normalizeLayoutPath(layout), { compileDebug: CONFIG.dev });
    }

    //

    static normalizeLayoutPath(path: string)
    {
        path = normalize(erudit.path.package('site', '_layout', path));

        if (!path.endsWith('.pug'))
            path += '.pug';

        return path;
    }
}