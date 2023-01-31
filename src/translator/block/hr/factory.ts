import { EruditBlockFactory } from "src/translator/block/eruditBlock";
import Hr from "./block";

export default class FHr extends EruditBlockFactory<Hr>
{
    canParse(str: string): boolean
    {
        return str === '---';
    }

    protected parse(str: string): Hr
    {
        return new Hr;
    }
}