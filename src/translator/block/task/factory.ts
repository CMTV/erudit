import { throwMetaError } from "@cmtv/error-meta";

import { EruditBlockObjFactory } from "src/translator/block/eruditBlock";
import Task from "./block";

export default class FTask extends EruditBlockObjFactory<Task>
{
    objType = 'task';

    protected parseObj(obj: any): Task
    {
        let task = new Task;

        ['title', 'difficulty', 'workload', 'statement'].forEach(required =>
        {
            if (!(required in obj))
                throwMetaError(`Task must have a '${required}' property!`, { 'Task data': obj });
        });

        task.title =        obj.title;
        task.difficulty =   obj.difficulty;
        task.workload =     obj.workload;
        task.important =    obj.important;

        ['statement', 'hint', 'solution', 'answer'].forEach(blockField =>
        {
            if (blockField in obj)
                task[blockField] = this.parser.parseBlocks(obj[blockField]);
        });

        return task;
    }
}