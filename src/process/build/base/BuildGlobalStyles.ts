import Style from "src/frontend/Style";
import EruditProcess from "src/process/EruditProcess";

export default class BuildGlobalStyles extends EruditProcess
{
    name = 'Global styles';

    async do()
    {
        Style.compile('global/global.scss', 'global.css');
    }
}