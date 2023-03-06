import { Text } from "blp";

import { QuoteTracker, RenderExtra } from "src/translator/Renderer";
import { InlinerView, InlinerViewFactory } from "src/translator/view";

export class VText extends InlinerView
{
    content: string;
}

export class VFText extends InlinerViewFactory<VText, Text>
{
    quoteTracker: QuoteTracker;

    async setupView(inliner: Text): Promise<VText>
    {
        let view = new VText;
            view.content = RenderExtra.afterStyle(inliner.content, this.quoteTracker);

        return view;
    }

    async getRender(view: VText): Promise<string>
    {
        return view.content;
    }
}