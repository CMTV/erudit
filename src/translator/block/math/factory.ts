import { EruditBlockFactory, EruditBlockObjFactory } from "src/translator/block/eruditBlock";
import Math from "./block";
import { skipFirstLine } from "src/util";

export default class FMath extends EruditBlockFactory<Math>
{
    canParse(str: string)
    {
        return /^\$\$[\s\S]+?\$\$$/gm.test(str);
    }

    protected parse(str: string): Math
    {
        let math = new Math;
            math.content = str.slice(2,-2).trim();

        return math;
    }
}

export class FObjMath extends EruditBlockFactory<Math>
{
    canParse(str: string): boolean
    {
        return str.startsWith('@math');
    }

    protected parse(str: string): Math
    {
        str = skipFirstLine(str);

        let math = new Math;
            math.content = str;

        return math;
    }
}