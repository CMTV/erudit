import { throwMetaError } from "@cmtv/error-meta";
import { erudit } from "src/erudit";

import { EruditBlockObjFactory } from "src/translator/block/eruditBlock";
import { transliterate } from "src/util/str";
import Task from "./block";

export default class FTask extends EruditBlockObjFactory<Task>
{
    objType = 'task';
    hasUniqueId: boolean;

    protected parseObj(obj: any): Task
    {
        this.hasUniqueId = !!this.blockMeta.id;

        let task = new Task;

        [/*'title', 'difficulty', 'workload',*/ 'statement'].forEach(required =>
        {
            if (!(required in obj))
                throwMetaError(`Task must have a '${required}' property!`, { 'Task data': obj });
        });

        task.title =        obj.title ?? erudit.lang.phrase('task.name');
        task.desc =         obj.desc;
        
        //task.difficulty =   obj.difficulty;
        //task.workload =     obj.workload;
        //task.important =    obj.important;

        ['statement', 'hint', 'solution', 'answer'].forEach(blockField =>
        {
            if (blockField in obj)
                task[blockField] = this.parser.parseBlocks(obj[blockField]);
        });

        return task;
    }

    protected getIdPrefix(task: Task)
    {
        return this.hasUniqueId ? 'task' : 'atask';
    }

    protected getIdContent(task: Task): string
    {
        if (this.hasUniqueId)
            return super.getIdContent(task);

        let id = task.title ?? erudit.lang.phrase('task.name');
            id = transliterate(id);
            id = id.replace(/[^\w\s.-]/g, '');
            id = id.trim();
            id = id.replace(/ +/g, '-');

        return id;
    }
}