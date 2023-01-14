import { InlinerRegexpFactory } from "blp";
import Math from "./inliner";

export default class FMath extends InlinerRegexpFactory<Math>
{
    protected regexp = /(?<!\\)\$(.+?)(?<!\\)\$/gm;

    protected parseMatch(match: RegExpExecArray): Math
    {
        let math = new Math;
            math.content = match[1];
            
        return math;
    }
}