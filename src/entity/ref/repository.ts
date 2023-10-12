import Repository from "src/db/Repository";
import DbRef from "./db";

export default class RepoRef extends Repository
{
    async getRefs()
    {
        return await this.db.manager.find(DbRef);
    }
}