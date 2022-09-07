import { Block } from "blp";

export abstract class ChunkBase extends Block
{
    _type = 'chunk';
    id: string;
}

export class ChunkStart extends ChunkBase   { _type = this._type + '-start'; }
export class ChunkEnd extends ChunkBase     { _type = this._type + '-end'; }