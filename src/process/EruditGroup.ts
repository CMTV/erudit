import { Group, Runnable } from "dobot";
import { DataSource } from "typeorm";

import { Erudit } from "src/erudit";

export default abstract class EruditGroup extends Group
{
    abstract getProcessTypes(): any[];

    protected erudit: Erudit;
    protected db: DataSource;

    constructor(erudit: Erudit, db: DataSource)
    {
        super();
        this.erudit = erudit;
        this.db = db;
    }

    todo()
    {
        return this.getProcessTypes().map(Type => new Type(this.erudit, this.db));
    }
}