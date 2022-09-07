import sass from "sass";
import path from "path";

import { erudit } from "src/erudit";
import { normalize, writeFile } from "src/util/io";

export default class Style
{
    static compile(src: string, dest: string)
    {
        let srcPath = normalize(erudit.path.package('site','_style', src));
        let destPath = normalize(erudit.path.site('site', 'styles', dest));

        let compileResult = sass.compile(srcPath, {

            loadPaths: [erudit.path.package('site/_style')],
            style: erudit.dev ? 'expanded' : 'compressed',
            sourceMap: true
        });

        let css = compileResult.css;

        if (erudit.dev)
        {
            css += `\n/*# sourceMappingURL=${path.basename(destPath)}.map */`;
            writeFile(destPath + '.map', JSON.stringify(compileResult.sourceMap));
        }

        writeFile(destPath, css);

        
    }
}