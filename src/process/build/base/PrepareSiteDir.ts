import fs from "fs";

import EruditProcess from "src/process/EruditProcess";

export default class PrepareSiteDir extends EruditProcess
{
    name = 'Prepare site directory';

    async do()
    {
        let siteDir = this.erudit.path.site();

        require('rimraf').sync(siteDir);
        fs.mkdirSync(siteDir);
    }
}