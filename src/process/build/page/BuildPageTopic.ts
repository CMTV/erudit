import DbBook from "src/entity/book/db";
import DbTopic from "src/entity/topic/db";
import RepoTopic from "src/entity/topic/repository";
import DbTopicToc from "src/entity/topicToc/db";
import ViewTopicTocItem from "src/entity/topicToc/view";
import Layout from "src/frontend/Layout";
import SEO from "src/page/component/SEO";
import PageTopic, { TopicType } from "src/page/PageTopic";
import EruditProcess from "src/process/EruditProcess";
import Renderer from "src/translator/Renderer";
import { readFile } from "src/util/io";

export default class BuildPageTopic extends EruditProcess
{
    name = 'Build topic pages';

    async do()
    {
        let topicIds = await (new RepoTopic(this.db)).getTopicIds();

        for (let i = 0; i < topicIds.length; i++)
        {
            let topicId = topicIds[i];
            let dbTopic = await this.db.manager.findOne(DbTopic, { where: { id: topicId }});
            let bookTitle = (await this.db.manager.findOne(DbBook, { where: { id: dbTopic.bookId }})).title;

            let topicTypes = Object.values(TopicType).filter(type => dbTopic[type]);

            let renderer = new Renderer;

            for (let j = 0; j < topicTypes.length; j++)
            {
                let type = topicTypes[j];

                renderer.location = { type: type, id: topicId };

                let page = new PageTopic;
                    page.topicType = type;
                    page.topicId = topicId;
                    page.bookId = dbTopic.bookId;

                    page.bookTitle = bookTitle;
                    page.bookToc = readFile(this.erudit.path.site('site', 'book-tocs', dbTopic.bookId + '.html'));

                    page.topicTypes = topicTypes;

                    page.next = dbTopic.nextId;
                    page.previous = dbTopic.previousId;

                    page.title = dbTopic.title;
                    page.desc = dbTopic.desc;
                    page.content = await renderer.renderBlocks(dbTopic[type]);

                    let dbTopicToc = (await this.db.manager.findOne(DbTopicToc, { where: { topicId: topicId, topicPart: type } })).toc;
                    page.toc = ViewTopicTocItem.makeListFrom(dbTopicToc);

                    page.seo = new SEO;
                    page.seo.title = `${dbTopic.title} | ${this.erudit.lang.phrase(type)} | ${bookTitle} ${this.erudit.lang.phrase('on')} OMath`;
                    page.seo.desc = dbTopic.desc;
                    page.seo.keywords = dbTopic.keywords;

                // Один общий метод compilePage (вдруг надо будет больше действий?)
                Layout.compileFile(`page/${page.layout}.pug`, page.getDest(), page);
            }
        }        
    }
}