import { withErrorMeta } from "@cmtv/error-meta";
import path from "path";

import RepoBook from "src/entity/book/repository";
import DbBookToc from "src/entity/bookToc/db";
import DataTopicConfig from "src/entity/topic/data";
import DbTopic from "src/entity/topic/db";
import EruditProcess from "src/process/EruditProcess";
import { BookTocItem, TopicBookTocItem } from "src/entity/bookToc/global";
import { ensureConfigExists, ensureConfigValid } from "src/entity/topic/validate";
import { parseYamlFile } from "src/util";
import DbTopicContributor from "src/entity/topicContributor/db";
import { Location, LocationType, ParseResult, Parser } from "translator";
import { exists, readFile } from "src/util/io";
import { BookTranslatorHelper } from "src/translator/helper";
import { insertParseResult } from "src/translator/db";
import BookStatsPW from "src/translator/parseWorker/BookStatsPW";
import DbTodo from "src/entity/todo/db";

export default class FillTopics extends EruditProcess
{
    name = 'Fill topics';

    helper: BookTranslatorHelper;

    async do()
    {
        let bookIds = await (new RepoBook(this.db)).getBookIds();

        for (let i = 0; i < bookIds.length; i++)
        {
            let bookId = bookIds[i];
            this.helper = new BookTranslatorHelper(bookId);

            let toc =   (await this.db
                                    .createQueryBuilder(DbBookToc, 'table')
                                    .select('table.toc')
                                    .where('table.bookId = :bookId', { bookId: bookId })
                                    .getOne()).toc;

            let tocTopics = this.getTopics(toc);

            for (let j = 0; j < tocTopics.length; j++)
            {
                let tocTopic = tocTopics[j];

                this.startStage(`Topic ${tocTopic.id}`);

                let handleResult = await this.handleTopic(tocTopic, bookId);

                handleResult.dbTopic.previousId =   tocTopics[j - 1]?.id;
                handleResult.dbTopic.nextId =       tocTopics[j + 1]?.id;

                await Promise.all([
                    this.db.manager.save([handleResult.dbTopic, ...handleResult.dbContributors, ...handleResult.dbTodos]),
                    insertParseResult(this.db, ...handleResult.parseResults),
                ]);
            }
        }
    }

    getTopics(tocItems: BookTocItem[]): TopicBookTocItem[]
    {
        if (!tocItems)
            return [];

        let toReturn = [];

        tocItems.forEach(tocItem =>
        {
            if (tocItem.type === 'topic')
                toReturn.push(tocItem);
            else
                toReturn = toReturn.concat(this.getTopics(tocItem.children));
        });

        return toReturn;
    }
    
    async handleTopic(tocTopic: TopicBookTocItem, bookId: string)
    {
        let dbTopic =           new DbTopic;
            dbTopic.id =        tocTopic.id;
            dbTopic.parts =     tocTopic.parts;
            dbTopic.bookId =    bookId;

        let topicPath = this.erudit.path.project('books', dbTopic.id);
        let configPath = path.join(topicPath, 'topic.yml');

        ensureConfigExists(configPath);
        let config: DataTopicConfig = parseYamlFile(configPath);
        withErrorMeta(() => ensureConfigValid(config), { Config: configPath });

        dbTopic.title =     config.title;
        dbTopic.desc =      config.desc;
        dbTopic.keywords =  config.keywords ?? [];

        dbTopic.wip = !!config.wip;
        dbTopic.advanced = !!config.advanced;
        dbTopic.dependencies = config.dependencies;

        dbTopic.seo =       config.seo;
        if (dbTopic?.seo?.title === null)
            dbTopic.seo.title = config.title;
        if (dbTopic?.seo?.desc === null)
            dbTopic.seo.desc = config.desc;

        let parseResults:   ParseResult[] = [];
        let dbTodos:        DbTodo[] = [];

        for (let i = 0; i < tocTopic.parts.length; i++)
        {
            let topicPart = tocTopic.parts[i];
            let topicPartPath = path.join(topicPath, topicPart + '.md');

            if (exists(topicPartPath))
            {
                let location = new Location;
                    location.type = topicPart as LocationType;
                    location.path = tocTopic.id;

                let parser = new Parser(location, this.helper);
                    parser.filterParseWorkers = (pwArr) => pwArr.concat([new BookStatsPW(bookId)]);

                let parseResult = await parser.parse(readFile(topicPartPath));

                dbTodos = dbTodos.concat(parseResult.todos.map(rawTodo =>
                {
                    let dbTodo = new DbTodo;
                        dbTodo.id =         rawTodo.id;
                        dbTodo.title =      rawTodo.title;
                        dbTodo.bookId =     bookId;
                        dbTodo.topicId =    tocTopic.id;
                        dbTodo.part =       topicPart;
                    
                    return dbTodo;
                }));

                parseResults.push(parseResult);
                dbTopic[topicPart] = parseResult.blocks;
            }
        }

        return {
            dbTopic:        dbTopic,
            parseResults:   parseResults,
            dbContributors: this.getDbContributors(tocTopic.id, bookId, config.contributors),
            dbTodos:        dbTodos,
        };
    }

    getDbContributors(topicId: string, bookId: string, contributors: string[]): DbTopicContributor[]
    {
        if (!contributors || contributors.length === 0)
            throw new Error('Empty contributors list!');
        
        let dbContributors = [];

        contributors.forEach((contributorId, i) =>
        {
            let dbContributor = new DbTopicContributor;
                dbContributor.topicId = topicId;
                dbContributor.contributorId = contributorId;
                dbContributor.bookId = bookId;
                dbContributor.displayOrder = i + 1;

            dbContributors.push(dbContributor);
        });

        return dbContributors;
    }
}