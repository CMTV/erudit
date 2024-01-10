import RepoBook from "src/entity/book/repository";
import EruditProcess from "../EruditProcess";
import DbBookSource from "src/entity/bookSource/db";
import { exists, normalize } from "src/util/io";
import { parseYamlFile } from "src/util";
import { TDataBookSource, TDataBookSources } from "src/entity/bookSource/data";

export default class FillBookSources extends EruditProcess
{
    name = 'Fill book reference sources';

    async do()
    {
        let dbSources: DbBookSource[] = [];

        const bookIds = await (new RepoBook(this.db)).getBookIds();
        for (const bookId of bookIds)
            dbSources = dbSources.concat(this.getSources(bookId));

        await this.db
                    .createQueryBuilder()
                    .insert()
                    .into(DbBookSource)
                    .values(dbSources)
                    .execute();
    }

    getSources(bookId: string): DbBookSource[]
    {
        const dbSources: DbBookSource[] = [];
        const sourcesPath = normalize(this.erudit.path.project('books', bookId, '@book', 'sources.yml'));

        if (!exists(sourcesPath))
            return dbSources;

        const sourcesData = parseYamlFile(sourcesPath) as TDataBookSources;

        const sourceIds = Object.keys(sourcesData);
        for (const sourceId of sourceIds)
            dbSources.push(this.makeDbSource(sourceId, bookId, sourcesData[sourceId]));

        return dbSources;
    }

    makeDbSource(sourceId: string, bookId: string, data: TDataBookSource): DbBookSource
    {
        const dbSource = new DbBookSource;
        
        dbSource.sourceId =           sourceId;
        dbSource.bookId =       bookId;

        const propKeys = Object.keys(data);
        for (const propKey of propKeys)
            dbSource[propKey] = data[propKey];

        return dbSource;
    }
}