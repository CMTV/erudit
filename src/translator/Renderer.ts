import { Inliner, Text } from "blp";

import { EruditBlock } from "src/translator/block/eruditBlock";
import { BlockView, BlockViewFactory, InlinerView, InlinerViewFactory } from "src/translator/view";

// Block Factories
import { VFParagraph } from "src/translator/block/paragraph/view";
import { VFHeading } from "./block/heading/view";
import { VFMath as VFMathBlock } from "./block/math/view";
import { VFList } from "./block/list/view";
import { VFAccentBlock } from "./block/accentBlock/view";
import { VFInclude } from "./block/include/view";

// Inliner Factories
import { VFText } from "./inliner/text/view";
import { VFMath as VFMathInliner } from "./inliner/math/view";

declare type TVFactory<TVFactoryType> = (new () => TVFactoryType);

export default class Renderer
{
    location: { type: string, id: string };

    blockFactories: { [type: string]: TVFactory<BlockViewFactory<BlockView, EruditBlock>> } = {
        paragraph:  VFParagraph,
        heading:    VFHeading,
        math:       VFMathBlock,
        list:       VFList,

        include:    VFInclude,

        important:  VFAccentBlock,
        definition: VFAccentBlock,
        theorem:    VFAccentBlock,
    };

    inlinerFactories: { [type: string]: TVFactory<InlinerViewFactory<InlinerView, Inliner>> } = {
        text: VFText,
        math: VFMathInliner,
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
                factory.renderer = this;

            return await factory.render(block);
        }

        return '';
    };
    
    async renderInliners(inliners: Inliner[])
    {
        let result = '';

        for (let i = 0; i < inliners.length; i++)
        {
            let inliner = inliners[i];
            if (inliner._type in this.inlinerFactories)
            {
                let factory = new this.inlinerFactories[inliner._type];
                    factory.renderer = this;
                
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

    static afterStyle(text: string)
    {
        text = text.replace(/\*\*(.+?)\*\*/gm, `<strong>$1</strong>`);
        text = text.replace(/\*(.+?)\*/gm, `<em>$1</em>`);

        text = text.replace(/ -- /gm, ' — ');

        {
            let quoteOpen = true;
            text = text.replace(/"/gm, () => (quoteOpen = !quoteOpen) ? '»' : '«');
        }

        return text;
    }
}