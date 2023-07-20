import Repository from "src/db/Repository";
import DbTopic from "./db";

export default class RepoTopic extends Repository
{
    async getTopicIds()
    {
        return  (await this.db
                    .createQueryBuilder(DbTopic, 'topic')
                    .select('topic.id')
                    .orderBy({ 'topic.id': 'ASC' })
                    .getMany())
                    .map(obj => obj.id);
    }

    async getNextPrevious(topicId: string)
    {
        if (!topicId)
            return {};

        let dbTopic = await this.db.manager.findOne(DbTopic, { select: ['title', 'parts'], where: { id: topicId } });

        if (!dbTopic)
            return {};

        return {
            link: topicId + '/@' + dbTopic.parts.shift(),
            title: dbTopic.title
        }
    }
}