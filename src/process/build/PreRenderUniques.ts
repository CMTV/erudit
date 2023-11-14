import { Block } from "bitran";
import RepoBook from "src/entity/book/repository";

import DbUnique from "src/entity/unique/db";
import EruditProcess from "src/process/EruditProcess";
import { BookTranslatorHelper, T_HELPER } from "src/translator/helper";
import { writeFile } from "src/util/io";
import { Location, Renderer } from "translator";
import { IsNull, Not } from "typeorm";

export default class PreRenderUniques extends EruditProcess
{
    name = 'Pre-render uniques';

    async do()
    {
        let bookIds = await (new RepoBook(this.db)).getBookIds();

        let uniqueIds = (await this.db.manager.find(DbUnique, { select: { id: true }, where: { content: Not(IsNull())} })).map(dbUnique => dbUnique.id);

        for (let i = 0; i < uniqueIds.length; i++)
        {
            let uniqueId = uniqueIds[i];
            let bookId = [...bookIds].filter(bookId => uniqueId.split('|')[1].startsWith(bookId)).pop(); // WHAT A PIECE OF SHIT, REFACTOR THIS PLEASE
            let uniqueContent = (await this.db.manager.findOne(DbUnique, { select: { content: true }, where: { id: uniqueIds[i] } })).content;
            await this.preRenderUnique(uniqueId, uniqueContent, bookId);
        }
    }

    async preRenderUnique(id: string, content: Block[], bookId: string = null)
    {
        let helper = T_HELPER;

        if (bookId)
            helper = new BookTranslatorHelper(bookId);

        let location = Location.fromString(id);
        let renderer = new Renderer(location, helper);
        let html = await renderer.renderBlocks(content);

        let dest = this.erudit.path.site('site', 'uniques', id.replace(/[\|:]/gm, '/') + '.html');

        writeFile(dest, html);
    }
}