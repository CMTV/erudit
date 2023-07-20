import { EruditBlockObjFactory } from "../eruditBlock";
import Table from "./block";

export default class FTable extends EruditBlockObjFactory<Table>
{
    objType = 'table';

    protected parseObj(obj: any): Table
    {
        let table = new Table;
            table.content = this.parser.parseBlocks(obj.content);
        
        return table;
    }
}