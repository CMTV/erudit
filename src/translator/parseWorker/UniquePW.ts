import { Product } from "blp";

import { uniqueMaker } from "src/entity/unique/global";
import { ParseResult } from "src/translator/Parser";
import DbUnique from "src/entity/unique/db";

import ParseWorker from "./ParseWorker";

export default class UniquePW extends ParseWorker
{
    uniques: DbUnique[] = [];

    step(product: Product)
    {
        let unique = uniqueMaker.getUnique(product);

        if (!unique)
            return;
            
        unique.id = this.location + '/' + unique.id;
        this.uniques.push(unique);
    }

    finally()
    {
        let hUniques = this.uniques.filter(unique => unique.id.match('/ah:'));

        hUniques.forEach((hUnique, i) =>
        {
            if (hUniques.slice(0, i).map(hUnique => hUnique.id).includes(hUnique.id))
                hUnique.id += '-';
        });
    }

    applyTo(parseResult: ParseResult)
    {
        parseResult.uniques = parseResult.uniques.concat([...this.uniques]);
    }
}