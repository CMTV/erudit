import { BlockView, BlockViewFactory } from "src/translator/view";
import Spoiler from "./block";

export class VSpoiler extends BlockView
{
    content: string;
}

export class VFSpoiler extends BlockViewFactory<VSpoiler, Spoiler>
{
    async setupBlockView(block: Spoiler): Promise<VSpoiler>
    {
        let view = new VSpoiler;
            view.content = await this.renderer.renderBlocks(block.content);

        return view;
    }

    async getRender(view: VSpoiler): Promise<string>
    {
        return view.content;
    }
}