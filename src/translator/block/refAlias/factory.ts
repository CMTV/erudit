import { BlockFactory } from "blp";

import RefAlias from "./block";

export default class FRefAlias extends BlockFactory<RefAlias>
{
    canParse(str: string): boolean
    {
        return str.startsWith('^ ');
    }

    parse(str: string): RefAlias
    {
        let refAlias = new RefAlias;

        str.split('\n').map(line => line.trim().slice(2)).forEach(line =>
        {
            let parts = line.split(' ');
            let alias = parts[0];
            let target = parts[1];

            refAlias.aliasMap[alias] = target;
        });

        return refAlias;
    }
}