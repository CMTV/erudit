import { globSync } from "glob";

import Script from "src/frontend/Script";
import EruditProcess from "src/process/EruditProcess";
import { toForwardSlash } from "src/util/io";

export default class BuildPageScripts extends EruditProcess
{
    name = 'Page scripts';

    async do()
    {
        let pages = globSync(toForwardSlash(this.erudit.path.package('site', '_script', 'page', '*.ts')));

        pages.forEach((pagePath: string) =>
        {
            let pageName = pagePath.replace(this.erudit.path.package('site', '_script', 'page'), '').replace('.ts', '');
            Script.compile(`page/${pageName}.ts`, `pages/${pageName}.js`);
        });
    }
}