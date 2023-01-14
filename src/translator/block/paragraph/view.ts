import Paragraph from "./block";
import { BlockView, BlockViewFactory } from "src/translator/view";
import Layout from "src/frontend/Layout";

export class VParagraph extends BlockView
{
    content: string;
}

export class VFParagraph extends BlockViewFactory<VParagraph, Paragraph>
{
    async setupBlockView(block: Paragraph): Promise<VParagraph>
    {
        let view = new VParagraph;
            view.content = await this.renderer.renderInliners(block.content);
        
        return view;
    }
    
    async getRender(view: VParagraph): Promise<string>
    {
        return Layout.renderFile('block/p.pug', view);
    }
}