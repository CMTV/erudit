import { Product, Factory } from "blp";
import { ParseResult } from "../Parser";
import ParseWorker from "./ParseWorker";
import RepoBookStats from "src/entity/bookStats/repository";
import { erudit } from "src/erudit";

export default class StatsPW extends ParseWorker
{
    stats = {
        definitions: 0,
        theorems: 0,
        tasks: 0
    }

    step(product: Product)
    {
        let type = product._type + 's';

        if (type in this.stats)
            this.stats[type]++;
    }

    applyTo(parseResult: ParseResult)
    {
        // TODO: Can I even use database here?
        if (!('bookId' in this.extra))
            return;

        let repoBookStats = new RepoBookStats(erudit.db);
        Object.keys(this.stats).forEach(statsName => repoBookStats.addTo(this.extra.bookId, statsName, this.stats[statsName]));
    }
}