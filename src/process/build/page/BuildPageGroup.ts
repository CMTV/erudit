import EruditGroup from "src/process/EruditGroup";
import BuildPageIndex from "./BuildPageIndex";
import BuildPageTopic from "./BuildPageTopic";

export default class BuildPageGroup extends EruditGroup
{
    name = 'Build pages';

    getProcessTypes()
    {
        return [
            BuildPageIndex,
            BuildPageTopic
        ];
    }
}