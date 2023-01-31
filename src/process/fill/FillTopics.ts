import { withErrorMeta } from "@cmtv/error-meta";
import fs from "fs";
import path from "path";

import RepoBook from "src/entity/book/repository";
import DbBookToc from "src/entity/bookToc/db";
import DataTopicConfig from "src/entity/topic/data";
import DbTopic from "src/entity/topic/db";
import EruditProcess from "src/process/EruditProcess";
import { BookTocItem, TopicBookTocItem } from "src/entity/bookToc/global";
import { ensureConfigExists, ensureConfigValid } from "src/entity/topic/validate";
import { parseYamlFile } from "src/util";
import parser, { ParseResult } from "src/translator/Parser";
import { TopicType } from "src/page/PageTopic";
import Location from "src/entity/location/global";
import { EruditBlock } from "src/translator/block/eruditBlock";

export default class FillTopics extends EruditProcess
{
    name = 'Fill topics';

    async do()
    {
        let bookIds = await (new RepoBook(this.db)).getBookIds();

        for (let i = 0; i < bookIds.length; i++)
        {
            let bookId = bookIds[i];
            let toc =   (await this.db
                                    .createQueryBuilder(DbBookToc, 'table')
                                    .select('table.toc')
                                    .where('table.bookId = :bookId', { bookId: bookId })
                                    .getOne()).toc;

            let tocTopics = this.getTopics(toc);

            let dbTopics: DbTopic[] = [];
            let parseResults: ParseResult[] = [];
            
            tocTopics.forEach(tocTopic =>
            {
                this.startStage(`Topic ${tocTopic.id}`);
                dbTopics.push(this.makeDbTopic(tocTopic, bookId, parseResults));
            });

            await ParseResult.insert(parseResults, this.db);

            for (let j = 0; j < dbTopics.length; j++)
            {
                let getAllowedType = (dbTopic: DbTopic) => Object.values(TopicType).filter(type => dbTopic[type]).shift();

                if (j !== 0)
                    dbTopics[j].previousId = dbTopics[j - 1].id + '/@' + getAllowedType(dbTopics[j - 1]);
                
                if (j !== dbTopics.length - 1)
                    dbTopics[j].nextId = dbTopics[j + 1].id + '/@' + getAllowedType(dbTopics[j + 1]);
            }

            this.startStage('Insert topics into database');

            await this.db
                        .createQueryBuilder()
                        .insert()
                        .into(DbTopic)
                        .values(dbTopics)
                        .execute();
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

    makeDbTopic(tocTopic: TopicBookTocItem, bookId: string, parseResults: ParseResult[]): DbTopic
    {
        let dbTopic =           new DbTopic;
            dbTopic.id =        tocTopic.id;
            dbTopic.parts =     tocTopic.parts;
            dbTopic.bookId =    bookId;

        let topicPath = this.erudit.path.project('books', dbTopic.id);
        let configPath = path.join(topicPath, 'config.yml');
        
        ensureConfigExists(configPath);

        let config: DataTopicConfig = parseYamlFile(configPath);

        withErrorMeta(() => ensureConfigValid(config), { Config: configPath });

        dbTopic.title = config.title;
        dbTopic.desc = config.desc;
        dbTopic.keywords = config.keywords ? config.keywords.join(', ') : null;

        tocTopic.parts.forEach(topicPart =>
        {
            let topicPartPath = path.join(topicPath, topicPart + '.md');
            if (fs.existsSync(topicPartPath))
            {
                let location = new Location;
                    location.type = topicPart;
                    location.id = tocTopic.id;

                let parseResult = parser.parse(
                    fs.readFileSync(topicPartPath, 'utf-8'),
                    location
                );

                // Checking for duplicating IDs (COPIED FROM UniquePW.ts!!!)
                {
                    let hUniques = parseResult.blocks.filter(unique => unique._id?.startsWith('ah:'));

                    hUniques.forEach((hUnique, i) =>
                    {
                        if (hUniques.slice(0, i).map(hUnique => hUnique._id).includes(hUnique._id))
                            hUnique._id += '-';
                    });

                    let tUniques = parseResult.blocks.filter(unique => unique._id?.startsWith('atask:'));

                    tUniques.forEach((tUnique, i) =>
                    {
                        if (tUniques.slice(0, i).map(tUnique => tUnique._id).includes(tUnique._id))
                            tUnique._id += '-';
                    });
                }

                parseResults.push(parseResult);
                dbTopic[topicPart] = parseResult.blocks;
            }
        });

        return dbTopic;
    }
}