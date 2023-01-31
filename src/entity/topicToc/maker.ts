import TreeMaker from "2tree";
import { Block } from "blp";

import { TocItem } from "src/entity/toc/global";
import { RenderExtra } from "src/translator/Renderer";

// Blocks
import Heading from "src/translator/block/heading/block";
import { AccentBlock } from "src/translator/block/accentBlock/factory";
import Include from "src/translator/block/include/block";
import Task from "src/translator/block/task/block";

export default class TopicTocMaker extends TreeMaker<Block, TocItem>
{
    rawToProduct(block: Block): TocItem
    {
        switch (block._type)
        {
            case 'heading':     return heading(block as Heading);
            case 'important':   return accentBlock(block as AccentBlock);
            case 'definition':  return accentBlock(block as AccentBlock);
            case 'theorem':     return accentBlock(block as AccentBlock);
            case 'task':        return task(block as Task);

            case 'include':     return include(block as Include);
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
        tocItem.title = RenderExtra.toPlainString(heading.title);

    return tocItem;
}

function accentBlock(accentBlock: AccentBlock): TocItem
{
    if (!accentBlock._id)
        return null;

    if (!accentBlock.title)
        return null;

    let tocItem = new TocItem;
        tocItem.type =  accentBlock._type;
        tocItem.id =    accentBlock._id;
        tocItem.title = accentBlock.title;

    return tocItem;
}

function include(include: Include): TocItem
{
    //return (new TopicTocMaker).make(include.)
    console.log()
    return null;
}

function task(task: Task): TocItem
{
    let tocItem = new TocItem;
        tocItem.type =  task._type;
        tocItem.id =    task._id;
        tocItem.title = task.title;

    return tocItem;
}