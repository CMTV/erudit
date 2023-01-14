import katex from "katex";

import { InlinerView, InlinerViewFactory } from "src/translator/view";
import Math from "./inliner";

export class VMath extends InlinerView
{
    content: string;
}

export class VFMath extends InlinerViewFactory<VMath, Math>
{
    async setupView(inliner: Math): Promise<VMath>
    {
        let view = new VMath;
            view.content = katex.renderToString(inliner.content, { displayMode: false });

        return view;
    }

    async getRender(view: VMath): Promise<string>
    {
        return '<span class="mathInline">' + view.content + '</span>';
    }
}