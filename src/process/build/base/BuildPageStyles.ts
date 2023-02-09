import glob from "glob";

import Style from "src/frontend/Style";
import EruditProcess from "src/process/EruditProcess";
import { b2fSlash } from "src/util/io";

export default class BuildPageStyles extends EruditProcess
{
    name = 'Page styles';

    async do()
    {
        let pages = glob.sync(b2fSlash(this.erudit.path.package()) + '/' +'site/_style/page/*.scss');

        pages.forEach((pagePath: string) =>
        {
            let pageName = pagePath.replace(b2fSlash(this.erudit.path.package()) + '/' + 'site/_style/page/', '').replace('.scss', '');
            Style.compile(`page/${pageName}.scss`, `pages/${pageName}.css`);
        });
    }
}