import { globSync } from "glob";

import Style from "src/frontend/Style";
import EruditProcess from "src/process/EruditProcess";
import { toForwardSlash } from "src/util/io";

export default class BuildPageStyles extends EruditProcess
{
    name = 'Page styles';

    async do()
    {
        let pages = globSync(toForwardSlash(this.erudit.path.package('site', '_style', 'page', '*.scss')));

        pages.forEach((pagePath: string) =>
        {
            let pageName = pagePath.replace(this.erudit.path.package('site', '_style', 'page'), '').replace('.scss', '');
            Style.compile(`page/${pageName}.scss`, `pages/${pageName}.css`);
        });
    }
}