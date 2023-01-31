import Location from "src/entity/location/global";
import DbUnique from "src/entity/unique/db";
import { erudit } from "src/erudit";
import { LinkRouter } from "src/translator/inliner/link/global";
import Renderer from "src/translator/Renderer";
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
        let contextLocation = new Location;
            contextLocation.type = this.renderer.location.type;
            contextLocation.id = this.renderer.location.id;

        let id = LinkRouter.getUniqueId(block.id, contextLocation);

        let dbUnique = await erudit.db.manager.findOne(DbUnique, { where: { id: id } });

        let view = new VInclude;
            view.content = '';

        if (dbUnique)
        {
            let renderer = new Renderer;
                renderer.location = { type: id.split('/')[0].slice(1), id: id.split('/').slice(1, -1).join('/') }
            
            view.content += await renderer.renderBlocks(dbUnique.content);
        }

        return view;
    }

    async getRender(view: VInclude): Promise<string>
    {
        return view.content;
    }
}