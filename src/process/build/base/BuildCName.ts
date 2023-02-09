import { CONFIG } from "src/config";
import EruditProcess from "src/process/EruditProcess";
import { writeFile } from "src/util/io";

export default class BuildCName extends EruditProcess
{
    name = 'Place CNAME';

    async do()
    {
        writeFile(
            this.erudit.path.site('CNAME'),
            CONFIG.getUrl().split('://').slice(1).join('://')
        );
    }
}