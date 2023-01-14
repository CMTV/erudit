import Heading from "./block";
import { BlockView, BlockViewFactory } from "src/translator/view";
import Layout from "src/frontend/Layout";

export class VHeading extends BlockView
{
    level: number;
    title: string;   
}

export class VFHeading extends BlockViewFactory<VHeading, Heading>
{
    async setupBlockView(block: Heading): Promise<VHeading>
    {
        let view = new VHeading;
            view.level = block.level;
            view.title = await this.renderer.renderInliners(block.title);
            
        return view;
    }

    async getRender(view: VHeading): Promise<string>
    {
        return Layout.renderFile('block/h.pug', view);    
    }
}