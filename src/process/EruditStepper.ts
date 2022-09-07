import { Stepper } from "dobot";
import { DataSource } from "typeorm";

import { Erudit } from "src/erudit";

export default abstract class EruditStepper<TStepData> extends Stepper<TStepData>
{
    erudit: Erudit;
    db: DataSource;

    constructor(erudit: Erudit, db: DataSource)
    {
        super();
        this.erudit = erudit;
        this.db = db;
    }
}