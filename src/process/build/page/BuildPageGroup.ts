import EruditGroup from "src/process/EruditGroup";

import BuildPageContributor from "./BuildPageContributor";
import BuildPageIndex from "./BuildPageIndex";
import BuildPageTopic from "./BuildPageTopic";
import BuildPageBook from "./BuildPageBook";
import BuildPageContributors from "./BuildPageContributors";
import BuildPageTodo from "./BuildPageTodo";
import BuildPageContributeGuide from "./BuildPageContributeGuide";
import BuildPageSponsors from "./BuildPageSponsors";

export default class BuildPageGroup extends EruditGroup
{
    name = 'Build pages';

    getProcessTypes()
    {
        return [
            BuildPageIndex,
            BuildPageTopic,
            BuildPageSponsors,
            BuildPageContributors,
            BuildPageContributor,
            BuildPageBook,
            BuildPageTodo,
            BuildPageContributeGuide,
        ];
    }
}