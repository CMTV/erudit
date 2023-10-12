import PageContributeGuide from "src/page/hq/PageContributeGuide";
import EruditProcess from "src/process/EruditProcess";

export default class BuildPageContributeGuide extends EruditProcess
{
    name = 'Build contribute guide page';

    async do()
    {
        let page = new PageContributeGuide;
     
        page.compile();
    }
}