import PageIndex from "src/page/PageIndex";
import BuildPageProcess from "./BuildPageProcess";
import DbBook from "src/entity/book/db";
import { IsNull, Not } from "typeorm";

export default class BuildPageIndex extends BuildPageProcess<PageIndex>
{
    pageLabel = 'index';

    async preparePages(): Promise<PageIndex>
    {
        let page = new PageIndex;
            page.wipBooks = await this.db.manager.find(DbBook, { where: { wipItems: Not(IsNull()) } });

        return page;
    }
}