import glob from "glob";

import Script from "src/frontend/Script";
import EruditProcess from "src/process/EruditProcess";

export default class BuildPageScripts extends EruditProcess
{
    name = 'Page scripts';

    async do()
    {
        let pages = glob.sync('site/_script/page/*.ts');

        pages.forEach((pagePath: string) =>
        {
            let pageName = pagePath.replace('site/_script/page', '').replace('.ts', '');
            Script.compile(`page/${pageName}.ts`, `pages/${pageName}.js`);
        });
    }
}