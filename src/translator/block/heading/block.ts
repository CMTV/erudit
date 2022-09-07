import { Inliner } from "blp";

import { EruditBlock } from "src/translator/block/eruditBlock";

export default class Heading extends EruditBlock
{
    _type = 'heading';
    
    level:  number;
    title:  Inliner[];
}