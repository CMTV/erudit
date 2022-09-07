import { Block } from "blp";
import { EruditBlock } from "src/translator/block/eruditBlock";

export default class Spoiler extends EruditBlock
{
    _type = 'spoiler';
    content: Block[];
}