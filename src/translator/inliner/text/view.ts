import { Text } from "blp";

import { RenderExtra } from "src/translator/Renderer";
import { InlinerView, InlinerViewFactory } from "src/translator/view";

export class VText extends InlinerView
{
    content: string;
}

export class VFText extends InlinerViewFactory<VText, Text>
{
    async setupView(inliner: Text): Promise<VText>
    {
        let view = new VText;
            view.content = RenderExtra.afterStyle(inliner.content);

        return view;
    }

    async getRender(view: VText): Promise<string>
    {
        return view.content;
    }
}