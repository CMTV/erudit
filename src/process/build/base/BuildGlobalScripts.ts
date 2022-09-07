import Script from "src/frontend/Script";
import EruditProcess from "src/process/EruditProcess";

export default class BuildGlobalScripts extends EruditProcess
{
    name = 'Global scripts';

    async do()
    {
        Script.compile('global/global.ts', 'global.js');
        
        if (this.erudit.dev)
            Script.compile('reload.ts', 'reload.js');
    }
}