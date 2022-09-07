import DbBook from "src/entity/book/db";
import Repository from "src/db/Repository";

export default class RepoBook extends Repository
{
    async getBookIds()
    {
        return  (await this.db
                    .createQueryBuilder(DbBook, 'book')
                    .select('book.id')
                    .orderBy({ displayOrder: 'ASC' })
                    .getMany())
                    .map(obj => obj.id);
    }
}