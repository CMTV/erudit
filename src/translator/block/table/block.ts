import { Block } from "blp";
import { EruditBlock } from "../eruditBlock";

export default class Table extends EruditBlock
{
    _type = 'table';
    content: Block[];
}