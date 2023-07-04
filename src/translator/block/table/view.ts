import { BlockView, BlockViewFactory } from "src/translator/view";
import Table from "./block";

export class VTable extends BlockView
{
    content: string;
}

export class VFTable extends BlockViewFactory<VTable, Table>
{
    async setupBlockView(block: Table)
    {
        let view = new VTable;
            view.content = await this.renderer.renderBlocks(block.content);
        
        return view;
    }

    async getRender(view: VTable)
    {
        return view.content;
    }
}