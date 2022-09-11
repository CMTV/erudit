import { Group } from "dobot";
import { DataSource } from "typeorm";

import { Erudit } from "src/erudit";

// Processes
import BuildPageGroup from "./page/BuildPageGroup";
import BuildBaseGroup from "./base/BuildBaseGroup";
import { FillBuildCache } from "./BuildCache";

export default class BuildGroup extends Group
{
    name = 'Build site';

    protected erudit: Erudit;
    protected db: DataSource;

    constructor(erudit: Erudit, db: DataSource)
    {
        super();
        this.erudit = erudit;
        this.db = db;
    }

    initProcesses(...Types: any[])
    {
        return Types.map(Type => new Type(this.erudit, this.db));
    }

    todo()
    {
        return this.initProcesses(
            FillBuildCache,
            BuildBaseGroup,
            BuildPageGroup
            // Build Pages
            // Nested Group Absract Class For auto-pages like Topic and etc.
        );
    }
}