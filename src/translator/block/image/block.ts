import { EruditBlock } from "src/translator/block/eruditBlock";

export default class Image extends EruditBlock
{
    _type = 'image';

    src : string;
    width: number;
    height: number;
    caption: string;
    invertible: boolean;
}