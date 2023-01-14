import katex from "katex";

import Layout from "src/frontend/Layout";
import { BlockViewFactory } from "src/translator/view";
import Math from "./block";

export class VMath extends Math
{}

export class VFMath extends BlockViewFactory<VMath, Math>
{
    async setupBlockView(block: Math): Promise<VMath>
    {
        let view = new VMath;
            view.content = katex.renderToString(block.content, { displayMode: true });

        return view;
    }

    async getRender(view: VMath): Promise<string>
    {
        return Layout.renderFile('block/math.pug', view);
    }
}