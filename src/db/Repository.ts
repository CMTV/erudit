import { DataSource } from "typeorm";

export default abstract class Repository
{
    protected db: DataSource;

    constructor(db: DataSource)
    {
        this.db = db;
    }
}