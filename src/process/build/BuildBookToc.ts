import { CONFIG } from "src/config";
import DbBookToc from "src/entity/bookToc/db";
import { BookTocItem, SectionBookTocItem, TopicBookTocItem } from "src/entity/bookToc/global";
import DbTopic from "src/entity/topic/db";
import { erudit } from "src/erudit";
import Layout from "src/frontend/Layout";
import EruditProcess from "src/process/EruditProcess";
import { link } from "src/router";
import { normalize, writeFile } from "src/util/io";
import { indent } from "src/util/str";

export default class BuildBookToc extends EruditProcess
{
    name = 'Build book toc';

    async do()
    {
        let bookIds = (await this.db
                            .createQueryBuilder(DbBookToc, 'bookToc')
                            .select('bookToc.bookId')
                            .getMany())
                            .map(obj => obj.bookId);

        for (let i = 0; i < bookIds.length; i++)
        {
            let bookId = bookIds[i];

            let dbToc = (await this.db
                                .createQueryBuilder(DbBookToc, 'bookToc')
                                .select('bookToc.toc')
                                .where('bookToc.bookId = :bookId', { bookId: bookId })
                                .getOne()).toc;

            let tocStr = await this.getHTMLToc(bookId, dbToc);
                tocStr = 'include /include/toc\n' + tocStr;
                tocStr = Layout.render(tocStr);

            let destPath = normalize(this.erudit.path.site('site', 'book-tocs', bookId + '.html'));

            writeFile(destPath, tocStr);
        }
    }

    async getHTMLToc(bookId: string, bookToc: BookTocItem[])
    {
        let pug = '';

        async function fillLevel(level: number, toc: BookTocItem[]): Promise<string>
        {
            let result = '';

            for (let tocItem of toc)
            {
                const advanced = !!(await erudit.db.manager.findOne(DbTopic, { select: ['advanced'], where: { id: tocItem.id } })).advanced;

                if (tocItem.type === 'topic')
                {
                    let types = (tocItem as TopicBookTocItem).parts;

                    let icon = 'topic-' + (types.length > 1 ? 'many' : types[0]);
                    if (icon === 'topic-article')
                        icon = 'file-lines';

                    let href = CONFIG.getUrl() + link(types[0] as any, tocItem.id);

                    result += `+tocItem(${level}, '${icon}', '${tocItem.title}', { dataId: '${tocItem.id}', href: '${href}', advanced: ${advanced} })\n`;
                }
                else
                {
                    let sectionTocItem = tocItem as SectionBookTocItem;
                    if (sectionTocItem.isChapter)
                    {
                        result += `+tocGroup('${sectionTocItem.title}')\n`;
                        result += indent(await fillLevel(level, sectionTocItem.children));
                    }
                    else
                    {
                        result += `+tocBookSection(${level}, '${sectionTocItem.title}')\n`;
                        result += indent(await fillLevel(level + 1, sectionTocItem.children));
                    }
                }
            }

            return result;
        }

        pug = `.bookToc(data-book-id="${bookId}", data-current='')\n` + indent('.tocTree\n');
        pug += indent(await fillLevel(0, bookToc), 2);

        return pug;
    }
}