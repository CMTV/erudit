import Repository from "src/db/Repository"
import DbSponsor from "./db"
import { Sponsor } from "./global";

export default class RepoSponsors extends Repository
{
    async getSponsors()
    {
        return (await this.db.manager.find(DbSponsor, {
            select: ['data'],
            order: { id: 'ASC' }
        })).map(dbSponsor => dbSponsor.data as Sponsor);
    }
}