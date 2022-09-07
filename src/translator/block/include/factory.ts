import { throwMetaError } from "@cmtv/error-meta";
import { BlockFactory, Product } from "blp";

import DbUnique from "src/entity/unique/db";
import { IdPrefix } from "src/entity/unique/global";
import { ChunkBase, ChunkEnd, ChunkStart } from "src/translator/block/chunk/block";
import Include from "./block";

export default class FInclude extends BlockFactory<Include>
{
    canParse(str: string): boolean
    {
        return str.startsWith('<~ ') && str.indexOf('\n') === -1;
    }

    protected parse(str: string): Include
    {
        let include = new Include;
            include.id = str.slice(3).trim();
        
        if (!include.id)
            return null;

        return include;
    }
}

export function getChunkUniques(products: Product[], location: string): DbUnique[]
{
    class ChunkPos { start: number; end: number; constructor(start: number) { this.start = start; } }

    let uniques: DbUnique[] = [];
    let chunkPosMap: { [chunkId: string]: ChunkPos } = {};

    for (let i = 0; i < products.length; i++)
    {
        let product = products[i];

        if (!(product instanceof ChunkBase))
            continue;
        
        if (product instanceof ChunkStart)
            chunkPosMap[product.id] = new ChunkPos(i);
        
        if (product instanceof ChunkEnd)
            if (product.id in chunkPosMap)
                chunkPosMap[product.id].end = i;
    }

    Object.keys(chunkPosMap).forEach(chunkId =>
    {
        let pos = chunkPosMap[chunkId];

        if (!pos.end)
            throwMetaError('Chunk has to be closed on the same level it was opened!', { 'Chunk ID': chunkId });

        let unique = new DbUnique;
            unique.id = location + '/' + IdPrefix.getPrefixFor('chunk') + ':' + chunkId;
            unique.content = products.slice(pos.start + 1, pos.end).filter(block => !!block && !(block instanceof ChunkBase));

        uniques.push(unique);

        products[pos.start] = products[pos.end] = null;
    });

    return uniques;
}