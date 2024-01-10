import EruditProcess from "../EruditProcess";
import DbTopicSourceRef from "src/entity/topicSourceRef/db";
import { exists, normalize } from "src/util/io";
import { parseYamlFile } from "src/util";
import { TDataTopicSourceRef, TDataTopicSourceRefs } from "src/entity/topicSourceRef/data";
import DbTopic from "src/entity/topic/db";
import DbBookSource from "src/entity/bookSource/db";

export default class FillTopicSourceRefs extends EruditProcess
{
    name = 'Fill topic refs to book sources';

    async do()
    {
        let dbSourceRefs: DbTopicSourceRef[] = [];

        const dbTopics = await this.db.manager.find(DbTopic, { select: ['id', 'bookId'] });
        for (const dbTopic of dbTopics)
            dbSourceRefs = dbSourceRefs.concat(await this.getSourceRefs(dbTopic.id, dbTopic.bookId));
        
        await this.db
                    .createQueryBuilder()
                    .insert()
                    .into(DbTopicSourceRef)
                    .values(dbSourceRefs)
                    .execute();
    }

    async getSourceRefs(topicId: string, bookId: string): Promise<DbTopicSourceRef[]>
    {
        const dbSourceRefs: DbTopicSourceRef[] = [];
        const refsPath = normalize(this.erudit.path.project('books', topicId, 'refs.yml'));

        if (!exists(refsPath))
            return dbSourceRefs;

        const refsData = parseYamlFile(refsPath) as TDataTopicSourceRefs;
        
        const sourceIds = Object.keys(refsData)
        for (const sourceId of sourceIds)
        {
            const sourceNumId = await this.getSourceNumId(sourceId, bookId);
            if (!sourceNumId)
            {
                this.warn(`Unknown source '${sourceId}' in topic '${topicId}'!`);
                continue;
            }

            for (const refData of refsData[sourceId])
                dbSourceRefs.push(this.makeDbSourceRef(sourceNumId, topicId, refData));
        }

        return dbSourceRefs;
    }

    async getSourceNumId(sourceStrId: string, bookId: string)
    {
        const dbBookSource = await this.db.manager.findOne(DbBookSource, {
            select: ['id'],
            where: { sourceId: sourceStrId, bookId },
        });

        return dbBookSource?.id;
    }

    makeDbSourceRef(sourceId: number, topicId: string, data: TDataTopicSourceRef): DbTopicSourceRef
    {
        const dbSourceRef = new DbTopicSourceRef;

        dbSourceRef.sourceId = sourceId;
        dbSourceRef.topicId = topicId;

        const propKeys = Object.keys(data);
        for (const propKey of propKeys)
            dbSourceRef[propKey] = data[propKey];

        return dbSourceRef;
    }
}