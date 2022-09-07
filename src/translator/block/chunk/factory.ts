import { BlockFactory } from "blp";

import { ChunkEnd, ChunkStart } from "./block";

export default class FChunk extends BlockFactory<ChunkStart | ChunkEnd>
{
    canParse(str: string): boolean
    {
        return str.startsWith('~~ ') && str.indexOf('\n') === -1;
    }
    protected parse(str: string): ChunkStart | ChunkEnd
    {
        let id = str.slice(3).trim();
        let isEnd = id.charAt(0) === '/';

        let chunk = isEnd ? new ChunkEnd : new ChunkStart;
            chunk.id = id;

        if (isEnd)
            chunk.id = chunk.id.slice(1);

        return chunk;
    }
}