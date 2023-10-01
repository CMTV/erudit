import EruditGroup from "src/process/EruditGroup";

import BuildPageContributor from "./BuildPageContributor";
import BuildPageIndex from "./BuildPageIndex";
import BuildPageTopic from "./BuildPageTopic";
import BuildPageBook from "./BuildPageBook";
import BuildPageContributors from "./BuildPageContributors";

export default class BuildPageGroup extends EruditGroup
{
    name = 'Build pages';

    getProcessTypes()
    {
        return [
            BuildPageIndex,
            BuildPageTopic,
            BuildPageContributors,
            BuildPageContributor,
            BuildPageBook,
        ];
    }
}