import EruditProcess from "src/process/EruditProcess";
import DbBook from "src/entity/book/db";
import DbShelf from "src/entity/shelf/db";
import { parseYamlFile } from "src/util";
import { exists, normalize } from "src/util/io";
import DataBookInfo from "src/entity/book/data";
import DbBookStats from "src/entity/bookStats/db";

export default class FillShelvesBooks extends EruditProcess
{
    name = 'Fill shelves and books';

    shelfId: number;
    bookDisplayOrder: number;

    async do()
    {
        this.shelfId = 0;
        this.bookDisplayOrder = 0;

        let dbBooks: DbBook[] = [];
        let dbShelves: DbShelf[] = [];

        Object.keys(this.erudit.books).forEach(key =>
        {
            let value = this.erudit.books[key];

            if (typeof value === 'string')
            {
                this.startStage(`Book '${value}'`);

                if (this.erudit.targets.bookAllowed(value))
                    dbBooks.push(this.makeDbBook(value, key));
            }
            else
            {
                this.startStage(`Shelf '${key}'`);

                let bookTitles = Object
                                    .keys(value)
                                    .filter(bookTitle => this.erudit.targets.bookAllowed(value[bookTitle]));

                if (bookTitles.length === 0)
                    return;

                dbShelves.push(this.makeDbShelf(key));
                bookTitles.forEach(bookTitle => dbBooks.push(this.makeDbBook(value[bookTitle], bookTitle, this.shelfId)));
            }
        });

        await this.db
                    .createQueryBuilder()
                    .insert()
                    .into(DbShelf)
                    .values(dbShelves)
                    .execute();

        await this.db
                    .createQueryBuilder()
                    .insert()
                    .into(DbBook)
                    .values(dbBooks)
                    .execute();

        let dbBooksStats = dbBooks.map(dbBook =>
        {
            let dbBookStats = new DbBookStats;
                dbBookStats.bookId = dbBook.id;
            
            return dbBookStats;
        });

        await this.db
                    .createQueryBuilder()
                    .insert()
                    .into(DbBookStats)
                    .values(dbBooksStats)
                    .execute();
    }

    makeDbShelf(title: string): DbShelf
    {
        let dbShelf = new DbShelf;
            dbShelf.id = ++this.shelfId;
            dbShelf.title = title;

        return dbShelf;
    }

    makeDbBook(id: string, title: string, shelfId: number = null): DbBook
    {
        let dbBook = new DbBook;
            dbBook.id = id;
            dbBook.title = title;
            dbBook.shelfId = shelfId;
            dbBook.displayOrder = ++this.bookDisplayOrder;

        let bookDir = this.erudit.path.project('books', id, '@book');
        let bookInfoPath = normalize(bookDir, 'info.yml');

        if (!exists(bookInfoPath))
            return dbBook;

        dbBook.hasDecoration = exists(normalize(bookDir, 'decoration.svg'));

        let bookInfo = parseYamlFile(bookInfoPath) as DataBookInfo;

        dbBook.desc ??= bookInfo.desc;
        dbBook.results ??= bookInfo.results;
        dbBook.topics ??= bookInfo.topics;

        return dbBook;
    }
}