import { BlockView, BlockViewFactory } from "src/translator/view";
import { VFImage, VImage } from "src/translator/block/image/view";
import Gallery from "./block";
import Layout from "src/frontend/Layout";

export class VGallery extends BlockView
{
    images: VImage[];
    displayImages: string[];
}

export class VFGallery extends BlockViewFactory<VGallery, Gallery>
{
    async setupBlockView(block: Gallery): Promise<VGallery>
    {
        let view = new VGallery;
            view.images = [];
            view.displayImages = [];

        let factory = new VFImage;
            factory.init(this.renderer);

        for (let i = 0; i < block.images.length; i++)
        {
            view.images.push(await factory.setupBlockView(block.images[i]));
            view.displayImages.push(await factory.render(block.images[i]));
        }

        return view;
    }

    async getRender(view: VGallery): Promise<string>
    {
        return Layout.renderFile('block/gallery.pug', view);
    }
}