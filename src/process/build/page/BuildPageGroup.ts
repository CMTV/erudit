import EruditGroup from "src/process/EruditGroup";
import BuildPageContributor from "./BuildPageContributor";
import BuildPageIndex from "./BuildPageIndex";
import BuildPageTopic from "./BuildPageTopic";

export default class BuildPageGroup extends EruditGroup
{
    name = 'Build pages';

    getProcessTypes()
    {
        return [
            BuildPageIndex,
            BuildPageTopic,
            BuildPageContributor,
        ];
    }
}