import { EruditBlock } from "src/translator/block/eruditBlock";
import Image from "src/translator/block/image/block";

export default class Gallery extends EruditBlock
{
    _type = 'gallery';

    showInRow: number;
    images: Image[];
}