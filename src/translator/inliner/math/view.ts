import katex from "katex";

import { erudit } from "src/erudit";
import { InlinerView, InlinerViewFactory } from "src/translator/view";
import Math from "./inliner";

export class VMath extends InlinerView
{
    content: string;
}

export class VFMath extends InlinerViewFactory<VMath, Math>
{
    macros;

    constructor()
    {
        super();
        this.macros = require(erudit.path.project('math'));
    }

    async setupView(inliner: Math): Promise<VMath>
    {
        let view = new VMath;
        
        try
        {
            view.content = katex.renderToString(inliner.content, { displayMode: false, strict: false, macros: this.macros });
        }
        catch (e)
        {
            view.content = 'Incorrect inline math!';
        }

        return view;
    }

    async getRender(view: VMath): Promise<string>
    {
        return '<span class="mathInline">' + view.content + '</span>';
    }
}