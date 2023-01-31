import { Inliner } from "blp";

import { EruditBlock } from "src/translator/block/eruditBlock";
import Renderer from "src/translator/Renderer";

abstract class ViewFactory<TProductView, TRaw>
{
    renderer: Renderer;

    abstract setupView(raw: TRaw): Promise<TProductView>;
    abstract getRender(view: TProductView): Promise<string>;

    init(renderer: Renderer)
    {
        this.renderer = renderer;
    }

    async render(raw: TRaw): Promise<string>
    {
        let view = await this.setupView(raw);
        return await this.getRender(view);
    }
}

//
// Block
//

export class BlockView
{
    _type:          string;
    _id?:           string;
    _classList?:    string[];
}

export abstract class BlockViewFactory<TBlockView extends BlockView, TBlock extends EruditBlock> extends ViewFactory<TBlockView, TBlock>
{
    abstract setupBlockView(block: TBlock): Promise<TBlockView>;

    async setupView(block: TBlock): Promise<TBlockView>
    {
        let view = await this.setupBlockView(block);
            view._type =        block._type;
            view._id =          block._id;
            view._classList =   block._classList;

        return view;
    }
}

//
// Inliner
//

export class InlinerView {}

export abstract class InlinerViewFactory<TInlinerView extends InlinerView, TInliner extends Inliner> extends ViewFactory<TInlinerView, TInliner>
{}