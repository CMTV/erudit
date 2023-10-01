import RepoContributor from "src/entity/contributor/repository";
import { ViewContributor } from "src/entity/contributor/view";
import PageContributors from "src/page/PageContributors";
import EruditProcess from "src/process/EruditProcess";

export default class BuildPageContributors extends EruditProcess
{
    name = 'Build contributors page';

    async do()
    {
        let page = new PageContributors;

        let repo = new RepoContributor(this.db);
        let contributorIds = await repo.getContributorIds();

        for (let i = 0; i < contributorIds.length; i++)
        {
            let contributorId = contributorIds[i];
            let view = await ViewContributor.fromId(contributorId);

            if (view.editor)
            {
                page.editors = page.editors ?? [];
                page.editors.push(view);
            }
            else
            {
                page.contributors = page.contributors ?? [];
                page.contributors.push(view);
            }
        }

        page.compile();
    }
}