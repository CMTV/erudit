import { Block } from "bitran";

import DbUnique from "src/entity/unique/db";
import EruditProcess from "src/process/EruditProcess";
import { T_HELPER } from "src/translator/helper";
import { writeFile } from "src/util/io";
import { Location, Renderer } from "translator";
import { IsNull, Not } from "typeorm";

export default class PreRenderUniques extends EruditProcess
{
    name = 'Pre-render uniques';

    async do()
    {
        let uniqueIds = (await this.db.manager.find(DbUnique, { select: { id: true }, where: { content: Not(IsNull())} })).map(dbUnique => dbUnique.id);

        for (let i = 0; i < uniqueIds.length; i++)
        {
            let uniqueContent = (await this.db.manager.findOne(DbUnique, { select: { content: true }, where: { id: uniqueIds[i] } })).content;
            await this.preRenderUnique(uniqueIds[i], uniqueContent);
        }
    }

    async preRenderUnique(id: string, content: Block[])
    {
        let location = Location.fromString(id);
        let renderer = new Renderer(location, T_HELPER);
        let html = await renderer.renderBlocks(content);

        let dest = this.erudit.path.site('site', 'uniques', id.replace(/[\|:]/gm, '/') + '.html');

        writeFile(dest, html);
    }
}