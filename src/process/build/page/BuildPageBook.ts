import DbBook from "src/entity/book/db";
import RepoBook from "src/entity/book/repository";
import { getContributorList } from "src/entity/book/view";
import RepoBookStats from "src/entity/bookStats/repository";
import PageBook from "src/page/PageBook";
import SEO from "src/page/component/SEO";
import EruditProcess from "src/process/EruditProcess";
import { copyFile, readFile } from "src/util/io";

export default class BuildPageBook extends EruditProcess
{
    name = 'Build book pages';

    async do()
    {
        let repoBook = new RepoBook(this.db);

        let bookIds = await repoBook.getBookIds();

        for (let i = 0; i < bookIds.length; i++)
        {
            let bookId = bookIds[i];
            let dbBook = await this.db.manager.findOne(DbBook, { where: { id: bookId }});

            let page = new PageBook;

                page.bookId = bookId;
                page.bookTitle = dbBook.title;
                page.bookToc = readFile(this.erudit.path.site('site', 'book-tocs', bookId + '.html'));

                page.topicCount = await repoBook.countBookTopics(bookId);

                let dbBookStats = await (new RepoBookStats(this.db)).getStatsFor(bookId);
                page.definitions =  dbBookStats.definitions;
                page.theorems =     dbBookStats.theorems;
                page.tasks =        dbBookStats.tasks;

                page.desc = dbBook.desc;
                page.results = dbBook.results;
                page.topics = dbBook.topics;

                page.wipItems = dbBook.wipItems;

                page.decoration = dbBook.hasDecoration ? '/' + dbBook.id + '/@book/decoration.svg' : null;

                page.firstTopicId = await repoBook.getFirstTopicId(bookId);
                page.contributors = await getContributorList(await repoBook.getBookContributors(bookId));

                page.seo = new SEO;
                page.seo.title = `${dbBook.title} ${this.erudit.lang.phrase('on')} OMath`;
                page.seo.desc = dbBook.desc;
                page.seo.keywords = dbBook.topics ? dbBook.topics.join(', ') : null;

            page.compile();

            if (dbBook.hasDecoration)
                copyFile(
                    this.erudit.path.project('books', bookId, '@book', 'decoration.svg'),
                    this.erudit.path.site(bookId, '@book', 'decoration.svg')
                )
        }
    }
}