import Repository from "src/db/Repository";
import DbShelf from "src/entity/shelf/db";
import DbBook from "src/entity/book/db";
import { GlobalTocView, GlobalTocBookView, GlobalTocShelfView } from "./view";

export default class RepoGlobalToc extends Repository
{
    async makeGlobalToc()
    {
        let globalToc: GlobalTocView = [];

        let books = await this.db.manager.find(DbBook, { order: { displayOrder: 'ASC' } });

        for (let i = 0; i < books.length; i++)
        {
            let dbBook = books[i];

            let j = i+1;

            for (; j < books.length; j++)
            {
                if (books[j].shelfId === dbBook.shelfId) continue;
                else break;
            }

            let dbShelf = dbBook.shelfId ? await this.db.manager.findOne(DbShelf, { where: { id: dbBook.shelfId } }) : null;

            let shelf = new GlobalTocShelfView;
                shelf.title = dbShelf?.title;
                shelf.books = books.slice(i, j).map(dbBook => {
                    let book = new GlobalTocBookView;
                        book.id = dbBook.id;
                        book.title = dbBook.title;

                    return book;
                });

            globalToc.push(shelf);

            i = j-1;
        }

        return globalToc;
    }
}