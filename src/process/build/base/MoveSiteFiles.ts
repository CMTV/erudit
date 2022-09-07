import glob from "glob";

import EruditProcess from "src/process/EruditProcess";
import { copyFile } from "src/util/io";

export default class MoveSiteFiles extends EruditProcess
{
    name = 'Move site files';

    async do()
    {
        let ignorePatterns = ['_*/**', '**/_*'];

        let siteFiles = glob.sync(
            'site/**/*',
            {
                ignore: ignorePatterns.map(pattern => 'site/' + pattern),
                nodir: true
            }
        );

        let rootFiles = glob.sync(
            'site/_root/**/*',
            {
                ignore: ignorePatterns.map(pattern => 'site/_root/' + pattern),
                nodir: true
            }
        );

        siteFiles.forEach(siteFile => copyFile(siteFile, this.erudit.path.site(siteFile)));
        rootFiles.forEach(rootFile => copyFile(rootFile, this.erudit.path.site(rootFile.replace('site/_root/', ''))));
    }
}