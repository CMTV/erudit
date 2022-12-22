import RepoGlobalToc from "src/entity/globalToc/repository";
import { GlobalTocView } from "src/entity/globalToc/view";
import OtherLink from "src/page/component/asideMajor/OtherLink";
import EruditProcess from "src/process/EruditProcess";

export class BuildCache
{
    gobalToc: GlobalTocView;
    otherLinks: OtherLink[];   
}

export class FillBuildCache extends EruditProcess
{
    name = 'Fill build cache';

    async do()
    {
        {
            let repo = new RepoGlobalToc(this.erudit.db);
            BUILD_CACHE.gobalToc = await repo.makeGlobalToc();
        }

        BUILD_CACHE.otherLinks = OtherLink.fromRaw(this.erudit.pConfig.links);
    }
}

export let BUILD_CACHE = new BuildCache;