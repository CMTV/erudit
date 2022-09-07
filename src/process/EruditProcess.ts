import { Process } from "dobot";
import { DataSource } from "typeorm";

import { Erudit } from "src/erudit";

export default abstract class EruditProcess extends Process
{
    protected erudit: Erudit;
    protected db: DataSource;

    constructor(erudit: Erudit, db: DataSource)
    {
        super();
        this.erudit = erudit;
        this.db = db;
    }
}