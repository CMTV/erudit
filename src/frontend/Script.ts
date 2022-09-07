import esbuild from "esbuild";

import { erudit } from "src/erudit";
import { normalize } from "src/util/io";

export default class Script
{
    static compile(src: string, dest: string)
    {
        let srcPath = normalize(erudit.path.package('site', '_script', src));
        let destPath = normalize(erudit.path.site('site', 'scripts', dest));

        esbuild.buildSync({
            entryPoints:    [srcPath],
            outfile:        destPath,
            sourcemap:      erudit.dev,
            minify:         !erudit.dev,
            charset:        'utf8',
            bundle:         true
        });
    }
}