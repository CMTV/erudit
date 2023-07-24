import { BlockView, BlockViewFactory } from "src/translator/view";
import Array from "./block";
import Layout from "src/frontend/Layout";

export class VArray extends BlockView
{
    items: string[];
}

export class VFArray extends BlockViewFactory<VArray, Array>
{
    async setupBlockView(block: Array): Promise<VArray>
    {
        let view  = new VArray;
            view.items = [];
        
        for (let i = 0; i < block.items.length; i++)
            view.items.push(await this.renderer.renderBlocks(block.items[i]));
        
        return view;
    }

    async getRender(view: VArray): Promise<string>
    {
        return Layout.renderFile('block/array.pug', view);
    }
}