import katex from "katex";

import { erudit } from "src/erudit";
import Layout from "src/frontend/Layout";
import { BlockViewFactory } from "src/translator/view";
import Math from "./block";

export class VMath extends Math
{}

export class VFMath extends BlockViewFactory<VMath, Math>
{
    macros;

    constructor()
    {
        super();
        this.macros = require(erudit.path.project('math'));
    }

    async setupBlockView(block: Math): Promise<VMath>
    {
        let view = new VMath;

        try
        {
            view.content = katex.renderToString(block.content, { displayMode: true, strict: false, macros: this.macros });
        }
        catch (e)
        {
            view.content = 'Incorrect block math!';
        }

        return view;
    }

    async getRender(view: VMath): Promise<string>
    {
        return Layout.renderFile('block/math.pug', view);
    }
}