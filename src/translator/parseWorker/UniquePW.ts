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
            
        unique.id = this.location.getFullId() + '/' + unique.id;
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

        let tUniques = this.uniques.filter(unique => unique.id.match('/atask:'));

        tUniques.forEach((tUnique, i) =>
        {
            if (tUniques.slice(0, i).map(tUnique => tUnique.id).includes(tUnique.id))
                tUnique.id += '-';
        });
    }

    applyTo(parseResult: ParseResult)
    {
        parseResult.uniques = parseResult.uniques.concat([...this.uniques]);
    }
}