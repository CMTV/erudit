import { getFakeHighTierPool, getFakeTier1Sponsors } from "src/entity/sponsor/fake";
import { Sponsor } from "src/entity/sponsor/global";
import RepoSponsors from "src/entity/sponsor/repository";
import Layout from "src/frontend/Layout";
import PageSponsors from "src/page/PageSponsors";
import EruditProcess from "src/process/EruditProcess";
import { copyFile, writeFile } from "src/util/io";

class TopicSponsorData
{
    templateFuncStr: string;
    fakeSponsors: Sponsor[];
    sponsors:
    {
        tier3: Sponsor[];
        tier2: Sponsor[];
    }

    constructor()
    {
        this.fakeSponsors = [];
        this.sponsors = { tier2: [], tier3: [] };
    }
}

export default class BuildPageSponsors extends EruditProcess
{
    name = 'Build sponsors page';

    topicSponsorsData: TopicSponsorData = new TopicSponsorData;

    async do()
    {
        let page = new PageSponsors;
        let repo = new RepoSponsors(this.db);

        let sponsors = await repo.getSponsors();

        for (let sponsor of sponsors)
            await this.handleSponsor(sponsor, page);

        if (page.tier1.length === 0)
            page.tier1 = getFakeTier1Sponsors();

        let fakePool = getFakeHighTierPool();

        this.topicSponsorsData.templateFuncStr =    Layout.compileFileClient('other/topicSponsor');
        this.topicSponsorsData.fakeSponsors =       fakePool;
        this.topicSponsorsData.sponsors.tier3 =     page.tier3;
        this.topicSponsorsData.sponsors.tier2 =     page.tier2;
        this.saveTopicSponsors();

        if (page.tier2.length <= 1 || page.tier3.length <= 1)
        {
            if (page.tier3.length === 0)
                page.tier3 = [...fakePool.slice(0, 3)].map(sponsor => {
                    sponsor.tier = 3;
                    return sponsor;
                });

            if (page.tier2.length === 0)
                page.tier2 = [...fakePool.slice(3, 6)].map(sponsor => {
                    delete sponsor['avatarVideo'];
                    sponsor.tier = 2;
                    return sponsor;
                });
        }

        if (page.retired.length === 0)
            delete page.retired;

        page.compile();
    }

    async handleSponsor(sponsor: Sponsor, page: PageSponsors)
    {
        if (sponsor.retired)
        {
            page.retired.push(sponsor);
            return;
        }

        if (sponsor.tier === 1)
        {
            page.tier1.push(sponsor);
            return;
        }

        //
        // Tier 2 and above
        //

        if (sponsor.avatar)
        {
            copyFile(
                this.erudit.path.project('sponsors', 'avatars', sponsor.avatar),
                this.erudit.path.site('site', 'assets', 'sponsors', sponsor.avatar)
            );

            sponsor.avatar = '/site/assets/sponsors/' + sponsor.avatar;
        }
        else sponsor.avatar = '/site/graphics/defaultSponsor.svg';

        if (sponsor.avatarVideo)
        {
            copyFile(
                this.erudit.path.project('sponsors', 'avatars', sponsor.avatarVideo),
                this.erudit.path.site('site', 'assets', 'sponsors', sponsor.avatarVideo)
            );

            sponsor.avatarVideo = '/site/assets/sponsors/' + sponsor.avatarVideo;
            delete sponsor.avatar;
        }

        page[`tier${sponsor.tier}`].push(sponsor);
    }

    saveTopicSponsors()
    {
        writeFile(
            this.erudit.path.site('site', 'topicSponsorData.json'),
            JSON.stringify(this.topicSponsorsData)
        );
    }
}