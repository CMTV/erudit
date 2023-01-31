import Layout from "src/frontend/Layout";
import { BlockView, BlockViewFactory } from "src/translator/view";
import Task from "./block";

export class VTask extends BlockView
{
    title:      string;
    desc?:      string;
    statement:  string;

    hint:       string;
    solution:   string;
    answer:     string;

    sections:   {[name: string]: string} = {};
}

export class VFTask extends BlockViewFactory<VTask, Task>
{
    async setupBlockView(block: Task): Promise<VTask>
    {
        let view = new VTask;
            view.title =        block.title;
            view.desc =         block.desc;
            view.statement =    await this.renderer.renderBlocks(block.statement);

        let sections = ['hint', 'solution', 'answer'].filter(section => section in block);

        for (let i = 0; i < sections.length; i++)
        {
            let section = sections[i];
            view.sections[section] = await this.renderer.renderBlocks(block[section]);
        }

        return view;
    }

    async getRender(view: VTask): Promise<string>
    {
        return Layout.renderFile('block/task.pug', view);
    }
}