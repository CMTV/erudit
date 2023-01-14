import { erudit } from "src/erudit";
import Layout from "src/frontend/Layout";
import { BlockView, BlockViewFactory } from "src/translator/view";
import { AccentBlock } from "./factory";

export class VAccentBlock extends BlockView
{
    title: string;
    showTitle: boolean;

    main: string;
    expand: { [title: string]: string }
}

export class VFAccentBlock extends BlockViewFactory<VAccentBlock, AccentBlock>
{
    async setupBlockView(block: AccentBlock): Promise<VAccentBlock>
    {
        let view = new VAccentBlock;
            view.title =        block.title;
            view.showTitle =    block.showTitle;

            view.main =         await this.renderer.renderBlocks(block.main);

        if (block.expand)
        {
            view.expand = {};

            let expand = block.expand;
            if (Array.isArray(expand))
                expand = { [erudit.lang.phrase(`abExpandDefault.${block._type}`)]: expand };
            
            for (let i = 0; i < Object.keys(expand).length; i++)
            {
                let key = Object.keys(expand)[i];
                view.expand[key] = await this.renderer.renderBlocks(expand[key]);
            }
        }

        return view;
    }

    async getRender(view: VAccentBlock): Promise<string>
    {
        return Layout.renderFile('block/accent.pug', view);
    }
}