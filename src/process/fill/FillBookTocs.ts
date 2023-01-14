import fs from "fs";
import path from "path";
import * as nkv from "nkv";
import { throwMetaError } from "@cmtv/error-meta";

import EruditProcess from "src/process/EruditProcess"
import RepoBook from "src/entity/book/repository";
import { BookTocItem, SectionBookTocItem, TopicBookTocItem } from "src/entity/bookToc/global";
import DbBookToc from "src/entity/bookToc/db";

export default class FillBookTocs extends EruditProcess
{
    name = 'Fill book tocs';

    async do()
    {
        let dbBookTocs: DbBookToc[] = [];
        let bookIds = await new RepoBook(this.db).getBookIds();

        bookIds.forEach(bookId =>
        {
            this.startStage(`Book '${bookId}'`);

            let nkvTree = this.getNkvTree(bookId);
            
            let toc = this.toToc(nkvTree, bookId, true);
                toc = this.clearEmptySections(toc);
                toc = this.createDefaultChapters(toc);

            let dbBookToc = new DbBookToc;
                dbBookToc.bookId = bookId;
                dbBookToc.toc = toc;
            
            dbBookTocs.push(dbBookToc);
        });

        this.startStage(`Insert book tocs into database`);

        await this.db
                    .createQueryBuilder()
                    .insert()
                    .into(DbBookToc)
                    .values(dbBookTocs)
                    .execute();
    }

    getNkvTree(bookId: string): nkv.NKVItem[]
    {
        let tocPath = this.erudit.path.project('books', bookId, '@book', 'toc.nkv');

        if (!fs.existsSync(tocPath))
            throwMetaError(`Missing 'toc.nkv' file!`, { File: tocPath });
        
        return nkv.parseFile(tocPath);
    }

    toToc(nkvItems: nkv.NKVItem[], id: string, rootLevel: boolean): BookTocItem[]
    {
        let tocItems: BookTocItem[] = [];

        nkvItems.forEach(nkvItem =>
        {
            let currentId = id + (nkvItem.value ? '/' + nkvItem.value : '');

            let tocItem: SectionBookTocItem | TopicBookTocItem;
            let isSection = nkvItem.hasChildren();
            let push = true;

            if (isSection)
            {
                tocItem = new SectionBookTocItem;
                tocItem.isChapter = rootLevel && nkvItem.key.charAt(0) === '!';
                tocItem.children = this.toToc(nkvItem.children, currentId, false);
                tocItem.title = nkvItem.key.substring(tocItem.isChapter ? 1 : 0);
            }
            else
            {
                tocItem = new TopicBookTocItem;
                tocItem.isOptional = nkvItem.key.charAt(0) === '*';
                tocItem.title = nkvItem.key.substring(tocItem.isOptional ? 1 : 0);
                tocItem.id = currentId;

                push = this.erudit.targets.pathAllowed(currentId);

                if (push)
                    tocItem.parts = this.detectTopicParts(currentId);
            }

            if (push)
                tocItems.push(tocItem);
        });

        return tocItems;
    }

    clearEmptySections(tocItems: BookTocItem[]): BookTocItem[]
    {
        return tocItems.filter(tocItem =>
        {
            if (tocItem instanceof TopicBookTocItem)
                return true;
            
            tocItem.children = this.clearEmptySections(tocItem.children);

            return tocItem.children.length > 0;
        });
    }

    createDefaultChapters(tocItems: BookTocItem[]): BookTocItem[]
    {
        let start, end;
            start = end = -1;

        for (let i = 0; i < tocItems.length; i++)
        {
            let tocItem = tocItems[i];

            if (!(tocItem as SectionBookTocItem).isChapter)
            {
                if (start === -1)
                    start = i;

                end = i;
            }
            else
            {
                if (start !== -1)
                    break;
            }
        }

        if (start === -1)
            return tocItems;
        
        let defaultChapter = new SectionBookTocItem;
            defaultChapter.isChapter = true;
            defaultChapter.title = '';
            defaultChapter.children = tocItems.slice(start, end + 1);

        tocItems.splice(start, end - start + 1, defaultChapter)

        return this.createDefaultChapters(tocItems);
    }

    detectTopicParts(topicId: string): string[]
    {
        let parts = [];
        let topicPath = this.erudit.path.project('books', topicId);

        ['article', 'summary', 'practicum'].forEach(topicPart =>
        {
            let topicPartPath = path.join(topicPath, topicPart + '.md');
            if (fs.existsSync(topicPartPath))
                parts.push(topicPart);
        });

        if (parts.length === 0)
            throwMetaError(`'Empty topic! Provide at least one topic part ('article', 'summary' or 'practicum')!`, { 'Topic ID': topicId });

        return parts.length > 0 ? parts : null;
    }
}