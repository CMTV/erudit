import { BlockView, BlockViewFactory } from "src/translator/view";
import Html from "./block";

export class VHtml extends BlockView
{
    content: string;
}

export class VFHtml extends BlockViewFactory<VHtml, Html>
{
    async setupBlockView(block: Html)
    {
        let view = new VHtml;
            view.content = block.content;

        let keys = Object.keys(block.inliners);
        for (let i = 0; i < keys.length; i++)
        {
            view.content = view.content.replace(`{{{${keys[i]}}}}`, await this.renderer.renderInliners(block.inliners[keys[i]]));
        }
        
        return view;
    }

    async getRender(view: VHtml)
    {
        return view.content;
    }
    
}