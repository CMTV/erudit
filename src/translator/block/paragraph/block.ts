import { Inliner } from "blp";

import { EruditBlock } from "src/translator/block/eruditBlock";

export default class Paragraph extends EruditBlock
{
    _type = 'paragraph';
    content: Inliner[];
}