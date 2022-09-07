import { Block } from "blp";

import { EruditBlock, EruditBlockFactory, EruditBlockObjFactory } from "src/translator/block/eruditBlock";
import { skipFirstLine } from "src/util";

//#region Definitions

export type TExpandContent = { [title: string]: Block[] } | Block[];

export class AccentBlock extends EruditBlock
{
    _type: string;
    title: string;
    main: Block[];
    expand: TExpandContent;
}

// export abstract class FAccentBlock extends EruditBlockFactory<AccentBlock>
// {
//     abstract getType(): string;

//     canParse(str: string): boolean
//     {
//         return str.startsWith('@' + this.getType());
//     }

//     protected parse(str: string): AccentBlock
//     {
//         str = skipFirstLine(str);

//         let block = new AccentBlock;
//             block._type = this.getType();
//             block.main = this.parser.parseBlocks(str);

//         return block;
//     }
// }

export abstract class FAccentBlock<TObj extends object = any> extends EruditBlockObjFactory<AccentBlock, TObj>
{
    abstract getMain(obj: TObj): Block[];
    abstract getExpand(obj: TObj): TExpandContent;

    protected getType(): string
    {
        return this.objType;
    }

    protected parseObj(obj: any): AccentBlock
    {
        let block = new AccentBlock;
            block._type =   this.getType();
            block.main =    this.getMain(obj);
            block.expand =  this.getExpand(obj);

        if (obj.title)        
            block.title = obj.title;

        return block;
    }

    protected parseExpand(toParse): TExpandContent
    {
        if (typeof toParse === 'object')
        {
            let toReturn = {...toParse};
            Object.keys(toReturn).forEach(key => toReturn[key] = this.parser.parseBlocks(toReturn[key]));
            return toReturn;
        }
        else return this.parser.parseBlocks(toParse);
    }
}

//#endregion

//
// Important
//

export class FImportant extends FAccentBlock
{
    objType = 'important';

    getMain(obj: any): Block[]
    {
        return this.parser.parseBlocks(obj.content);
    }

    getExpand(obj: any): TExpandContent
    {
        return null;
    }   
}

//
// Theorem
//

export class FTheorem extends FAccentBlock
{
    objType = 'theorem';

    getMain(obj: any): Block[]
    {
        return this.parser.parseBlocks(obj.statement);
    }

    getExpand(obj: any): TExpandContent
    {
        return this.parseExpand(obj.proof);
    }
}