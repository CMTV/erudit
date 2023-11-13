import sizeOf from "image-size";

import { CONFIG } from "src/config";
import DbBook from "src/entity/book/db";
import { getBookDecorationLink } from "src/entity/book/global";
import { ViewBaseContributor } from "src/entity/contributor/view";
import RepoTodo from "src/entity/todo/repository";
import { ViewTodoItem } from "src/entity/todo/view";
import DbTopic from "src/entity/topic/db";
import RepoTopic from "src/entity/topic/repository";
import DbTopicContributor from "src/entity/topicContributor/db";
import DbTopicToc from "src/entity/topicToc/db";
import ViewTopicTocItem from "src/entity/topicToc/view";
import OgImg from "src/page/component/OgImg";
import SEO from "src/page/component/SEO";
import PageTopic, { TopicType } from "src/page/PageTopic";
import EruditProcess from "src/process/EruditProcess";
import { link } from "src/router";
import { BookTranslatorHelper } from "src/translator/helper";
import { copyFile, exists, readFile } from "src/util/io";
import { Location, Renderer } from "translator";

export default class BuildPageTopic extends EruditProcess
{
    name = 'Build topic pages';

    async do()
    {
        let topicRepo = new RepoTopic(this.db);
        let topicIds = await topicRepo.getTopicIds();

        for (let i = 0; i < topicIds.length; i++)
        {
            let topicId = topicIds[i];
            let dbTopic = await this.db.manager.findOne(DbTopic, { where: { id: topicId }});
            let dbBook = await this.db.manager.findOne(DbBook, { where: { id: dbTopic.bookId }});

            let helper = new BookTranslatorHelper(dbBook.id);

            let nextData = await topicRepo.getNextPrevious(dbTopic.nextId);
            let previousData = await topicRepo.getNextPrevious(dbTopic.previousId);

            let topicTypes = Object.values(TopicType).filter(type => dbTopic[type]);

            let ogImg = await this.getOgImg(topicId);

            for (let j = 0; j < topicTypes.length; j++)
            {
                let type = topicTypes[j];

                let location = new Location;
                    location.type = type as any;
                    location.path = topicId;

                let renderer = new Renderer(location, helper);

                let page = new PageTopic;
                    page.topicType = type;
                    page.topicId = topicId;
                    page.bookId = dbTopic.bookId;

                    page.bookTitle = dbBook.title;
                    page.bookToc = readFile(this.erudit.path.site('site', 'book-tocs', dbTopic.bookId + '.html'));

                    page.decoration = dbBook.hasDecoration ? getBookDecorationLink(dbBook.id) : null;

                    page.topicTypes = topicTypes;

                    page.next = nextData.link;
                    page.nextTitle = nextData.title;

                    page.previous = previousData.link;
                    page.previousTitle = previousData.title;

                    page.title = dbTopic.title;
                    page.desc = dbTopic.desc;
                    page.content = await renderer.renderBlocks(dbTopic[type]);

                    let dbTopicToc = (await this.db.manager.findOne(DbTopicToc, { where: { topicId: topicId, topicPart: type } })).toc;
                    page.toc = ViewTopicTocItem.makeListFrom(dbTopicToc);

                    page.seo = new SEO;
                    page.seo.title = `${dbTopic.title} | ${this.erudit.lang.phrase(type)} | ${page.bookTitle} ${this.erudit.lang.phrase('on')} OMath`;
                    page.seo.desc = dbTopic.desc;
                    page.seo.keywords = dbTopic.keywords;
                    page.seo.ogImg = ogImg;

                    page.todos = await this.getViewTodos(dbTopic.id, type);

                    page.contributors = await this.getViewContributors(dbTopic.id);

                page.compile();
            }
        }
    }

    async getViewContributors(topicId: string): Promise<ViewBaseContributor[]>
    {
        let contributors = [];

        let contributorIds = (await this.db.manager.find(DbTopicContributor, { where: { topicId: topicId }, order: { displayOrder: 'ASC' } })).map(dbItem => dbItem.contributorId);

        for (let i = 0; i < contributorIds.length; i++)
            contributors.push(await ViewBaseContributor.fromId(contributorIds[i]));
        
        return contributors;
    }

    async getViewTodos(topicId: string, part: string): Promise<ViewTodoItem[]>
    {
        let repo = new RepoTodo(this.db);
        let dbTodos = await repo.getTopicTodos(topicId, part);
        let viewTodos = dbTodos.map(dbTodo => ViewTodoItem.fromDbTodo(dbTodo));

        return viewTodos.length === 0 ? null : viewTodos;
    }
    
    async getOgImg(topicId: string)
    {
        let imgSrcPath = this.erudit.path.project('books', topicId, 'ogImage.png');
        
        if (!exists(imgSrcPath))
            return null;

        // Auto Generate if not found!

        let imgDestPath = this.erudit.path.site(link('topicFile', topicId, 'ogImage.png'));
        copyFile(imgSrcPath, imgDestPath);

        let size = sizeOf(imgSrcPath);

        let ogImg = new OgImg;
            ogImg.href = CONFIG.getUrl() + link('topicFile', topicId, 'ogImage.png');
            ogImg.width = size.width;
            ogImg.height = size.height;

        return ogImg;
    }
}