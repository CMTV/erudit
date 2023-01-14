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

    // async getTopicTypes(topicId: string)
    // {
    //     let article = (await this.db.createQueryBuilder(DbTopic, 'topic').select('1'))

    // }
}