import { BlockView, BlockViewFactory } from "src/translator/view"
import Hr from "./block";

export class VHr extends BlockView
{} // <- TODO: Rewrite this piece shit. Allow BlockViewFactory to accept nothing.

export class VFHr extends BlockViewFactory<VHr, Hr>
{
    async setupBlockView(block: Hr): Promise<VHr>
    {
        return new VHr;
    }

    async getRender(view: VHr): Promise<string>
    {
        return '<hr>';
    }
}