import Repository from "src/db/Repository";
import DbBookStats from "./db";

export default class RepoBookStats extends Repository
{
    async getStatsFor(bookId: string)
    {
        return await this.db.manager.findOne(DbBookStats, { where: { bookId: bookId }});
    }

    async addTo(bookId: string, statName: string, value = 1)
    {
        await this.db.createQueryBuilder()
            .update(DbBookStats)
            .where({ bookId: bookId })
            .set( { [statName]: () => `${statName} + ${value}` })
            .execute();
    }
}