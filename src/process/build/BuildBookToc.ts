import { CONFIG } from "src/config";
import DbBookToc from "src/entity/bookToc/db";
import { BookTocItem, SectionBookTocItem, TopicBookTocItem } from "src/entity/bookToc/global";
import Layout from "src/frontend/Layout";
import EruditProcess from "src/process/EruditProcess";
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

            let tocStr = this.getHTMLToc(bookId, dbToc);
                tocStr = 'include /include/toc\n' + tocStr;
                tocStr = Layout.render(tocStr);

            let destPath = normalize(this.erudit.path.site('site', 'book-tocs', bookId + '.html'));

            writeFile(destPath, tocStr);
        }
    }

    getHTMLToc(bookId: string, bookToc: BookTocItem[])
    {
        let pug = '';

        function fillLevel(level: number, toc: BookTocItem[]): string
        {
            let result = '';

            toc.forEach(tocItem =>
            {
                if (tocItem.type === 'topic')
                {
                    let types = (tocItem as TopicBookTocItem).parts;

                    let icon = 'topic-' + (types.length > 1 ? 'many' : types[0]);
                    if (icon === 'topic-article')
                        icon = 'file-lines';

                    let href = `${CONFIG.getUrl()}/${tocItem.id}/@${types[0]}`;

                    result += `+tocItem(${level}, '${icon}', '${tocItem.title}', { dataId: '${tocItem.id}', href: '${href}' })\n`;
                }
                else
                {
                    let sectionTocItem = tocItem as SectionBookTocItem;
                    if (sectionTocItem.isChapter)
                    {
                        result += `+tocGroup('${sectionTocItem.title}')\n`;
                        result += indent(fillLevel(level, sectionTocItem.children));
                    }
                    else
                    {
                        result += `+tocBookSection(${level}, '${sectionTocItem.title}')\n`;
                        result += indent(fillLevel(level + 1, sectionTocItem.children));
                    }
                }
            });

            return result;
        }

        pug = `.bookToc(data-book-id="${bookId}", data-current='')\n` + indent('.tocTree\n');
        pug += indent(fillLevel(0, bookToc), 2);

        return pug;
    }
}