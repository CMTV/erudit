import Layout from "src/frontend/Layout";
import { BlockView, BlockViewFactory } from "src/translator/view";
import List from "./block";

export class VList extends BlockView
{
    type:       'ol' | 'ul';
    olStart:    number;
    items:      string[];
}

export class VFList extends BlockViewFactory<VList, List>
{
    async setupBlockView(block: List): Promise<VList>
    {
        let view = new VList;
            view.type = block.type;
            view.olStart = block.olStart;
            view.items = [];

        for (let i = 0; i < block.items.length; i++)
            view.items.push(await this.renderer.renderBlocks(block.items[i]));

        return view;
    }

    async getRender(view: VList): Promise<string>
    {
        return Layout.renderFile('block/list.pug', view);        
    }
}