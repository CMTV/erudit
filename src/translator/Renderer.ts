import { Inliner, Text } from "blp";

import { EruditBlock } from "src/translator/block/eruditBlock";
import { BlockView, BlockViewFactory, InlinerView, InlinerViewFactory } from "src/translator/view";

// Block Factories
import { VFParagraph } from "./block/paragraph/view";
import { VFHeading } from "./block/heading/view";
import { VFMath as VFMathBlock } from "./block/math/view";
import { VFList } from "./block/list/view";
import { VFAccentBlock } from "./block/accentBlock/view";
import { VFInclude } from "./block/include/view";
import { VFHr } from "./block/hr/view";
import { VFImage } from "./block/image/view";
import { VFGallery } from "./block/gallery/view";
import { VFTask } from "./block/task/view";

// Inliner Factories
import { VFText } from "./inliner/text/view";
import { VFMath as VFMathInliner } from "./inliner/math/view";
import { VFLink } from "./inliner/link/view";

declare type TVFactory<TVFactoryType> = (new () => TVFactoryType);

export default class Renderer
{
    location: { type: string, id: string };

    blockFactories: { [type: string]: TVFactory<BlockViewFactory<BlockView, EruditBlock>> } = {
        paragraph:  VFParagraph,
        heading:    VFHeading,
        math:       VFMathBlock,
        list:       VFList,
        hr:         VFHr,

        image:      VFImage,
        gallery:    VFGallery,

        include:    VFInclude,

        task:       VFTask,

        important:  VFAccentBlock,
        example:    VFAccentBlock,
        definition: VFAccentBlock,
        theorem:    VFAccentBlock,
    };

    inlinerFactories: { [type: string]: TVFactory<InlinerViewFactory<InlinerView, Inliner>> } = {
        text: VFText,
        math: VFMathInliner,
        link: VFLink,
    };

    async renderBlocks(blocks: EruditBlock[]): Promise<string>
    {
        let result = '';

        for (let i = 0; i < blocks.length; i++)
            result += await this.renderBlock(blocks[i]);

        return result;
    };

    async renderBlock(block: EruditBlock): Promise<string>
    {
        if (block._type in this.blockFactories)
        {
            let factory = new this.blockFactories[block._type];
                factory.init(this);

            return await factory.render(block);
        }

        return '';
    };
    
    async renderInliners(inliners: Inliner[])
    {
        let result = '';
        let quoteTracker = new QuoteTracker;

        for (let i = 0; i < inliners.length; i++)
        {
            let inliner = inliners[i];
            if (inliner._type in this.inlinerFactories)
            {
                let factory = new this.inlinerFactories[inliner._type];
                    factory.renderer = this;

                if (inliner._type === 'text')
                    (factory as VFText).quoteTracker = quoteTracker;
                
                result += await factory.render(inliner);
            }
        }

        return result;
    };
}

export class RenderExtra
{
    static toPlainString(inliners: Inliner[])
    {
        let str = '';

        inliners.forEach(inliner =>
        {
            switch (inliner._type)
            {
                case 'text':
                    str += (inliner as Text).content;
                    break;
            }
        });

        return str;
    }

    static afterStyle(text: string, quoteTracker: QuoteTracker)
    {
        text = text.replace(/\*\*(.+?)\*\*/gm, `<strong>$1</strong>`);
        text = text.replace(/\*(.+?)\*/gm, `<em>$1</em>`);

        text = text.replace(/ -- /gm, ' — ');

        {
            //let quoteOpen = true;
            text = text.replace(/"/gm, () => (quoteTracker.open = !quoteTracker.open) ? '»' : '«');
        }

        return text;
    }
}

export class QuoteTracker
{
    open = true;
}