import { Block } from "blp";

import { EruditBlock } from "src/translator/block/eruditBlock";

export default class List extends EruditBlock
{
    _type = 'list';

    type: 'ol' | 'ul';
    olStart: number;
    items: Block[][];
}