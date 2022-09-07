import PageIndex from "src/page/PageIndex";
import BuildPageProcess from "./BuildPageProcess";

export default class BuildPageIndex extends BuildPageProcess<PageIndex>
{
    preparePages(): PageIndex
    {
        let page = new PageIndex;
        return page;
    }
}