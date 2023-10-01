import { Block } from "bitran";
import RepoBookStats from "src/entity/bookStats/repository";
import { erudit } from "src/erudit";
import { ParseWorker } from "translator";

export default class BookStatsPW extends ParseWorker
{
    bookId: string;

    constructor(bookId: string)
    {
        super();
        this.bookId = bookId;
    }

    blockStep(block: Block)
    {
        let repo = new RepoBookStats(erudit.db);

        if (['task', 'definition', 'theorem'].includes(block.type))
            repo.addTo(this.bookId, block.type + 's');
    }
}