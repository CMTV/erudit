import TreeMaker from "2tree";
import { Block } from "bitran";

import { TocItem } from "src/entity/toc/global";

// Blocks
import { Heading } from "translator/content";
import { AccentBlock } from "translator/content";
import { Include } from "translator/content";
import { Task } from "translator/content";

export default class TopicTocMaker extends TreeMaker<Block, TocItem>
{
    rawToProduct(block: Block): TocItem
    {
        switch (block.type)
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
        return block.type === 'heading';
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
        tocItem.type =  heading.type;
        tocItem.id =    heading['id'];
        tocItem.title = heading.title;

    return tocItem;
}

function accentBlock(accentBlock: AccentBlock): TocItem
{
    if (!accentBlock['id'])
        return null;

    if (!accentBlock.title)
        return null;

    if (!accentBlock.showInToc)
        return null;

    let tocItem = new TocItem;
        tocItem.type =  accentBlock.type;
        tocItem.id =    accentBlock['id'];
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
        tocItem.type =  task.type;
        tocItem.id =    task['id'];
        tocItem.title = task.title;

    return tocItem;
}