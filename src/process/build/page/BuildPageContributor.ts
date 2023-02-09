import DbBook from "src/entity/book/db";
import DbContributor from "src/entity/contributor/db";
import DbTopic from "src/entity/topic/db";
import DbTopicContributor from "src/entity/topicContributor/db";
import SEO from "src/page/component/SEO";
import PageContributor from "src/page/PageContributor";
import EruditProcess from "src/process/EruditProcess";
import Renderer from "src/translator/Renderer";
import { copyFile } from "src/util/io";

export default class BuildPageContributor extends EruditProcess
{
    name = 'Build contributor pages';

    async do()
    {
        let contributorIds = (await this.db.manager.find(DbContributor, { select: { id: true } })).map(dbItem => dbItem.id);

        for (let i = 0; i < contributorIds.length; i++)
            await this.buildContributorPage(contributorIds[i]);
    }

    async buildContributorPage(contributorId: string)
    {
        let dbContributor = await this.db.manager.findOne(DbContributor, { where: { id: contributorId } });

        let page = new PageContributor;
            page.id = contributorId;

            page.avatar =   dbContributor.avatarExt ? `/site/graphics/contributors/${contributorId}.${dbContributor.avatarExt}` : `/site/graphics/defaultAvatar.png`;
            page.name =     dbContributor.displayName ?? dbContributor.name ?? dbContributor.id;
            page.slogan =   dbContributor.slogan;

            let renderer = new Renderer;
                renderer.location = {
                    type: 'contributor',
                    id: contributorId
                }

            if (dbContributor.about)
                page.content = await renderer.renderBlocks(dbContributor.about);

            page.seo = new SEO;
            page.seo.title = `${page.name} ${this.erudit.lang.phrase('on')} OMath`;

            page.contribution = await this.getContribution(contributorId);

            page.contributionCount = 0;
            page.contribution.map(book => page.contributionCount += book.topics.length);

            if (dbContributor.avatarExt)
                copyFile(
                    this.erudit.path.project('contributors', contributorId, `avatar.${dbContributor.avatarExt}`),
                    this.erudit.path.site('site', 'graphics', 'contributors', contributorId + '.' + dbContributor.avatarExt)
                )

        page.compile();
    }

    async getContribution(contributorId: string)
    {
        let topicIds = (await this.db.manager.find(DbTopicContributor, { select: { topicId: true }, where: { contributorId: contributorId } })).map(dbItem => dbItem.topicId);

        let bookTopicMap = {};

        for (let i = 0; i < topicIds.length; i++)
        {
            let topicId = topicIds[i];
            let data = (await this.db.manager.findOne(DbTopic, { select: { bookId: true, title: true, parts: true }, where: { id: topicId } }));

            if (!(data.bookId in bookTopicMap))
                bookTopicMap[data.bookId] = [];
        
            bookTopicMap[data.bookId].push({ id: topicId, title: data.title, part: data.parts[0] });
        }

        let contribution = [];

        let bookIds = Object.keys(bookTopicMap);
        for (let i = 0; i < bookIds.length; i++)
        {
            let bookId = bookIds[i];
            let bookTitle = (await this.db.manager.findOne(DbBook, { select: { title: true }, where: { id: bookId } })).title;

            let bookViewItem = new ViewContributionBook;
                bookViewItem.title = bookTitle;
                bookViewItem.topics = [];
            
            bookTopicMap[bookId].forEach(topicData =>
            {
                let topicViewItem = new ViewContributionTopic;
                    topicViewItem.title = topicData.title;
                    topicViewItem.link = `/${topicData.id}/@${topicData.part}/`;

                bookViewItem.topics.push(topicViewItem);
            });

            contribution.push(bookViewItem);
        }

        return contribution;
    }
}

class ViewContribution
{
    title: string;
}

export class ViewContributionBook extends ViewContribution
{
    topics: ViewContributionTopic[];
}

export class ViewContributionTopic extends ViewContribution
{
    link: string;
}