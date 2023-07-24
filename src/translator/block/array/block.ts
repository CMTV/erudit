import { EruditBlock } from "../eruditBlock";

export default class Array extends EruditBlock
{
    _type = 'array';
    items: EruditBlock[][];
}