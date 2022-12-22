import PageIndex from "src/page/PageIndex";
import BuildPageProcess from "./BuildPageProcess";

export default class BuildPageIndex extends BuildPageProcess<PageIndex>
{
    pageLabel = 'index';

    async preparePages(): Promise<PageIndex>
    {
        let page = new PageIndex;
        return page;
    }
}