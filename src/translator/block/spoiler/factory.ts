import { throwMetaError } from "@cmtv/error-meta";

import { EruditBlockFactory } from "src/translator/block/eruditBlock";
import { skipFirstLine } from "src/util";
import Spoiler from "./block";

export default class FSpoiler extends EruditBlockFactory<Spoiler>
{
    canParse(str: string): boolean
    {
        return str.startsWith('@spoiler');
    }

    protected parse(str: string): Spoiler
    {
        if (!this.blockMeta.id)
            throwMetaError(`Spoiler must have an 'id' property!`, { 'Spoiler data': str });

        str = skipFirstLine(str);

        let spoiler = new Spoiler;
            spoiler.content = this.parser.parseBlocks(str);

        return spoiler;
    }
}