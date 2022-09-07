import { Block, BlockFactory, BlockObjFactory } from "blp";

import { IdPrefix } from "src/entity/unique/global";

export abstract class EruditBlock extends Block
{
    _id?:        string;
    _classList?: string[];
}

// !!!
// !!! TODO: USE MIXIN INSTEAD OF COPY-PASTE FOR CODE BELOW !!!
// !!!

export abstract class EruditBlockFactory<TBlock extends EruditBlock> extends BlockFactory<TBlock>
{
    protected getIdPrefix(block: TBlock)
    {
        return IdPrefix.getPrefixFor(block._type);
    }

    protected getIdContent(block: TBlock)
    {
        return this.blockMeta.id;
    }

    protected makeId(block: TBlock)
    {
        let prefix = this.getIdPrefix(block);
        let content = this.getIdContent(block);

        if (!prefix || !content)
            return null;

        return prefix + ':' + content;
    }

    protected postParse(block: TBlock)
    {
        if (this.blockMeta.classList)
            block._classList = this.blockMeta.classList;

        let id = this.makeId(block);
        if (id)
            block._id = id;
    }
}

export abstract class EruditBlockObjFactory<TBlock extends EruditBlock, TObj extends object = any> extends BlockObjFactory<TBlock, TObj>
{
    protected getIdPrefix(block: TBlock)
    {
        return IdPrefix.getPrefixFor(block._type);
    }

    protected getIdContent(block: TBlock)
    {
        return this.blockMeta.id;
    }

    protected makeId(block: TBlock)
    {
        let prefix = this.getIdPrefix(block);
        let content = this.getIdContent(block);

        if (!prefix || !content)
            return null;

        return prefix + ':' + content;
    }

    protected postParse(block: TBlock)
    {
        if (this.blockMeta.classList)
            block._classList = this.blockMeta.classList;

        let id = this.makeId(block);
        if (id)
            block._id = id;
    }
}