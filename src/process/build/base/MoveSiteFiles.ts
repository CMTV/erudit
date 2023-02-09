import glob from "glob";

import EruditProcess from "src/process/EruditProcess";
import { b2fSlash, copyFile } from "src/util/io";

export default class MoveSiteFiles extends EruditProcess
{
    name = 'Move site files';

    async do()
    {
        let ignorePatterns = ['_*/**', '**/_*'];

        let sitePath = b2fSlash(this.erudit.path.package()) + '/';
        let siteRootPath = b2fSlash(this.erudit.path.package()) + '/';

        let siteFiles = glob.sync(
            sitePath + 'site/**/*',
            {
                ignore: ignorePatterns.map(pattern => sitePath + 'site/' + pattern),
                nodir: true,
            }
        );

        let rootFiles = glob.sync(
            siteRootPath + 'site/_root/**/*',
            {
                ignore: ignorePatterns.map(pattern => siteRootPath + 'site/_root/' + pattern),
                nodir: true,
            }
        );

        siteFiles.forEach(siteFile => copyFile(
            siteFile,
            this.erudit.path.site(siteFile.replace(sitePath, ''))
        ));

        rootFiles.forEach(rootFile => copyFile(
            rootFile,
            this.erudit.path.site(rootFile.replace(siteRootPath, '').replace('site/_root/', ''))
        ));
    }
}