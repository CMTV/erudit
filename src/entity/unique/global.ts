import { EruditBlock } from "src/translator/block/eruditBlock";
import DbUnique from "./db";

import Heading from "src/translator/block/heading/block";
import Spoiler from "src/translator/block/spoiler/block";

export class UniqueMaker
{
    getUnique(from: EruditBlock): DbUnique
    {
        let method = this['getUnique' + from._type.at(0).toUpperCase() + from._type.slice(1)];
        if (method)
            return method(from);

        if (!from._id)
            return null;

        let unique = new DbUnique;
            unique.id = from._id;
            unique.content = [from];
        
        return unique;
    }

    //
    //
    //

    getUniqueHeading(heading: Heading)
    {
        let unique = new DbUnique;
            unique.id = heading._id;
        
        return unique;
    }

    getUniqueSpoiler(spoiler: Spoiler)
    {
        let unique = new DbUnique;
            unique.id = spoiler._id;
            unique.content = spoiler.content;

        return unique;
    }
}

export let uniqueMaker = new UniqueMaker;

export class IdPrefix
{
    private static p2tMap = {
        p: 'paragraph',
        h: 'heading',
        s: 'spoiler',
        c: 'chunk',
        i: 'important',

        d: 'definition',
        t: 'theorem',
    }

    private static t2pMap;

    static genT2PMap()
    {
        this.t2pMap = {};
        Object.keys(this.p2tMap).forEach(prefix => this.t2pMap[this.p2tMap[prefix]] = prefix);
    }

    static getPrefixFor(type: string)
    {
        return this.t2pMap[type] ?? type;
    }

    static getTypeFor(prefix: string)
    {
        return this.p2tMap[prefix];
    }
}

IdPrefix.genT2PMap();