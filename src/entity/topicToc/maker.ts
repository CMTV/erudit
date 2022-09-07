import TreeMaker from "2tree";
import { Block } from "blp";

import { TocItem } from "src/entity/toc/global";
import Renderer from "src/translator/Renderer";

// Blocks
import Heading from "src/translator/block/heading/block";

export default class TopicTocMaker extends TreeMaker<Block, TocItem>
{
    rawToProduct(block: Block): TocItem
    {
        switch (block._type)
        {
            case 'heading': return heading(block as Heading);
        }

        return null;
    }

    isContainer(block: Block): boolean
    {
        return block._type === 'heading';
    }

    isChild(block: Block, container: Block): boolean
    {
        if (this.isContainer(block))
            if (block['level'] <= container['level'])
                return false;

        return true;
    }
}

//
// TODO: Allow others to provide handler for their own block types? Even setup custom child-parent?
//

function heading(heading: Heading): TocItem
{
    let tocItem = new TocItem;
        tocItem.type =  heading._type;
        tocItem.id =    heading._id;
        tocItem.title = Renderer.plainStr(heading.title);

    return tocItem;
}