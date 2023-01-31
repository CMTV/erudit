import { Block } from "blp";

import DbUnique from "src/entity/unique/db";
import EruditProcess from "src/process/EruditProcess";
import { VFSpoiler } from "src/translator/block/spoiler/view";
import Renderer from "src/translator/Renderer";
import { writeFile } from "src/util/io";
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
        id = id.split('/').map((part, i, arr) => i === arr.length - 1 ? part.replace(':', '_') : part).join('/');

        let renderer = new Renderer;
            renderer.inlinerFactories['spoiler'] = VFSpoiler;
            renderer.location = {
                type: id.split('/')[0].slice(1),
                id: id.split('/').slice(1, -1).join('/')
            }

        let html = await renderer.renderBlocks(content);

        let dest = this.erudit.path.site('site', 'uniques', id + '.html');

        writeFile(dest, html);
    }
}