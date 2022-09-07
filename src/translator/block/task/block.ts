import { Block } from "blp";

import { EruditBlock } from "src/translator/block/eruditBlock";

export default class Task extends EruditBlock
{
    _type = 'task';

    title:      string;

    difficulty: number;
    workload:   number;
    important:  boolean;

    statement:  Block[];
    hint:       Block[];
    solution:   Block[];
    answer:     Block[];
}