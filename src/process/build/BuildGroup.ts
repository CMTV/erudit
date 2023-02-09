import { Group } from "dobot";
import { DataSource } from "typeorm";

import { Erudit } from "src/erudit";

// Processes
import { FillBuildCache } from "./BuildCache";
import BuildBookToc from "./BuildBookToc";
import BuildPageGroup from "./page/BuildPageGroup";
import BuildBaseGroup from "./base/BuildBaseGroup";
import PreRenderUniques from "./PreRenderUniques";
import { WriteSitemap } from "./WriteSitemap";
import { WriteRobots } from "./WriteRobots";

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
            BuildBookToc,
            PreRenderUniques,
            BuildPageGroup,
            WriteSitemap,
            WriteRobots,
            // Build Pages
            // Nested Group Absract Class For auto-pages like Topic and etc.
        );
    }
}