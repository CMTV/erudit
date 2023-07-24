import Location from "src/entity/location/global";
import Layout from "src/frontend/Layout";
import { BlockView, BlockViewFactory } from "src/translator/view";
import Image from "./block";

export class VImage extends BlockView
{
    src: string;
    width: number;
    height: number;
    caption: string;
    invertible: boolean;

    minWidth: number;
    maxWidth: number;
}

export class VFImage extends BlockViewFactory<VImage, Image>
{
    async setupBlockView(block: Image): Promise<VImage>
    {
        let view = new VImage;
            view.src = '/site/files/' + Location.fromString(block.src).toPath();
            view.width = block.width;
            view.height = block.height;
            view.caption = block.caption;
            view.invertible = block.invertible;
            view.minWidth = block.minWidth;
            view.maxWidth = block.maxWidth;

        return view;
    }

    async getRender(view: VImage): Promise<string>
    {
        return Layout.renderFile('block/image.pug', view);
    }
}