import { EruditBlockObjFactory } from "../eruditBlock";
import Array from "./block";

export default class FArray extends EruditBlockObjFactory<Array>
{
    objType = 'array';
    
    protected parseObj(obj: any): Array
    {
        let array = new Array;
            array.items = [];

        if (obj.items)
            obj.items.forEach(item => array.items.push(this.parser.parseBlocks(item)));

        return array;
    }
}