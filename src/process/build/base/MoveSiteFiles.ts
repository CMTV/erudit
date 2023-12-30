import { globSync } from "glob";
import { copyAssetsTo } from "translator/node";

import EruditProcess from "src/process/EruditProcess";
import { copyFile, toForwardSlash } from "src/util/io";

export default class MoveSiteFiles extends EruditProcess
{
    name = 'Move site files';

    async do()
    {
        let ignorePatterns = (path) => 
        {
            let patterns = ['**/_*', '_*/**'];
            return patterns.map(pattern => path + '/' + pattern);
        }

        let sitePath = this.erudit.path.package('site');
        let siteRootPath = this.erudit.path.package('site', '_root');

        let siteFiles = globSync(
            toForwardSlash(sitePath) + '/**/*',
            {
                ignore: ignorePatterns(toForwardSlash(sitePath)),
                nodir: true
            }
        );

        let rootFiles = globSync(
            toForwardSlash(siteRootPath) + '/**/*',
            {
                ignore: ignorePatterns(toForwardSlash(siteRootPath)),
                nodir: true
            }
        );

        //
        // Move
        //

        siteFiles.forEach(siteFile => copyFile(
            siteFile,
            this.erudit.path.site(siteFile.replace(sitePath, 'site'))
        ));

        rootFiles.forEach(rootFile => copyFile(
            rootFile,
            this.erudit.path.site(rootFile.replace(siteRootPath, '').replace('site/_root/', ''))
        ));

        // Move translator files
        copyAssetsTo(this.erudit.path.site('site', 'content'));
    }
}