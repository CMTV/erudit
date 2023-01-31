import { Block } from "blp";

import EruditProcess from "src/process/EruditProcess";
import RepoTopic from "src/entity/topic/repository";
import DbTopicToc from "src/entity/topicToc/db";
import DbTopic from "src/entity/topic/db";
import TopicTocMaker from "src/entity/topicToc/maker";
import { TopicType } from "src/page/PageTopic";
import DbUnique from "src/entity/unique/db";
import Include from "src/translator/block/include/block";

/**
 * Generates toc trees for every topic part.
 * They will be used to display topic part structure on frontend.
 */
export default class FillTopicTocs extends EruditProcess
{
    name = 'Fill topic tocs';

    async do()
    {
        let dbTopicTocs: DbTopicToc[] = [];

        let topicIds = await new RepoTopic(this.db).getTopicIds();

        for (let i = 0; i < topicIds.length; i++)
        {
            let topic = await this.db.manager.findOne(DbTopic, { where: { id: topicIds[i] } });        

            this.startStage(`Generate toc for topic '${topic.id}'`);

            for (let j = 0; j < Object.values(TopicType).length; j++)
            {
                let part = Object.values(TopicType)[j];

                this.startStage(`Generate toc for part '${part}' in topic '${topic.id}'`);

                let blocks = topic[part] as Block[];

                if (!blocks)
                    continue;

                blocks = await this.extendBlockList(blocks);

                let dbTopicToc = new DbTopicToc;
                    dbTopicToc.topicId = topic.id;
                    dbTopicToc.topicPart = part;
                    dbTopicToc.toc = (new TopicTocMaker).make(blocks);

                dbTopicTocs.push(dbTopicToc);
            }
        }

        this.startStage('Insert topic tocs into database');

        await this.db
                    .createQueryBuilder()
                    .insert()
                    .into(DbTopicToc)
                    .values(dbTopicTocs)
                    .execute();
    }

    async extendBlockList(blocks: Block[]): Promise<Block[]>
    {
        let fullList: Block[] = [];

        for (let i = 0; i < blocks.length; i++)
        {
            let skip = false;
            let block = blocks[i];

            if (block._type === 'include')
            {
                skip = true;

                let dbUnique = await this.db.manager.findOne(DbUnique, { where: { id: (block as Include).id } });
                if (dbUnique)
                {
                    fullList = fullList.concat(await this.extendBlockList(dbUnique.content));
                }
            }

            if (skip)
                continue;
            
            fullList.push(block);
        }

        return fullList;
    }
}