import DbUnique from "src/entity/unique/db";
import { erudit } from "src/erudit";
import { BlockView, BlockViewFactory } from "src/translator/view";
import Include from "./block";

export class VInclude extends BlockView
{
    content: string;
}

export class VFInclude extends BlockViewFactory<VInclude, Include>
{
    async setupBlockView(block: Include): Promise<VInclude>
    {
        let id = block.id;
        let idArr = id.split('/');

        switch (idArr.length)
        {
            case 1:
                id = `@${this.renderer.location.type}/${this.renderer.location.id}/${id}`; break;
            case 2:
                id = `${idArr[0]}/${this.renderer.location.id}/${idArr[1]}`; break;
        }

        let dbUnique = await erudit.db.manager.findOne(DbUnique, { where: { id: id } });

        let view = new VInclude;
            view.content = '';

        if (dbUnique)
            view.content += await this.renderer.renderBlocks(dbUnique.content);

        return view;
    }

    async getRender(view: VInclude): Promise<string>
    {
        return view.content;
    }
}