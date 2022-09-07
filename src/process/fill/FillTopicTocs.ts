import { Block } from "blp";

import EruditProcess from "src/process/EruditProcess";
import RepoTopic from "src/entity/topic/repository";
import DbTopicToc from "src/entity/topicToc/db";
import DbTopic from "src/entity/topic/db";
import TopicTocMaker from "src/entity/topicToc/maker";

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

            ['article', 'summary', 'practice'].forEach(part =>
            {
                this.startStage(`Generate toc for part '${part}' in topic '${topic.id}'`);

                let blocks = topic[part] as Block[];

                if (!blocks)
                    return;

                let dbTopicToc = new DbTopicToc;
                    dbTopicToc.topicId = topic.id;
                    dbTopicToc.topicPart = part;
                    dbTopicToc.toc = (new TopicTocMaker).make(blocks);

                dbTopicTocs.push(dbTopicToc);
            });
        }

        this.startStage('Insert topic tocs into database');

        await this.db
                    .createQueryBuilder()
                    .insert()
                    .into(DbTopicToc)
                    .values(dbTopicTocs)
                    .execute();
    }
}