import { EruditBlockFactory } from "src/translator/block/eruditBlock";
import Math from "./block";

export default class FMath extends EruditBlockFactory<Math>
{
    canParse(str: string)
    {
        return str.startsWith('$$') && str.endsWith('$$');
    }

    protected parse(str: string): Math
    {
        let math = new Math;
            math.content = str.slice(2,-2).trim();

        return math;
    }
}