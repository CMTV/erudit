import Repository from "src/db/Repository";
import DbShelf from "src/entity/shelf/db";
import DbBook from "../book/db";
import GlobalTocView, { GlobalTocBookView } from "./view";

export default class RepoGlobalToc extends Repository
{
    async makeGlobalToc()
    {
        let globalToc = new GlobalTocView;

        let shelfs = await this.db.manager.find(DbShelf);
        
        for (let i = 0; i < shelfs.length; i++)
        {
            let shelf = shelfs[i];
            let books = await this.db.manager.find(DbBook, { where: { shelfId: shelf.id } });

            globalToc[shelf.title] = [];

            books.forEach(book =>
            {
                let bookView = new GlobalTocBookView;
                    bookView.id = book.id;
                    bookView.title = book.title;

                globalToc[shelf.title].push(bookView);
            });
        }

        return globalToc;
    }
}