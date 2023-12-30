import DbBook from "src/entity/book/db";
import Repository from "src/db/Repository";
import DbTopic from "../topic/db";
import DbTopicContributor from "../topicContributor/db";
import { link } from "src/router";
import { TopicType } from "src/page/PageTopic";

export default class RepoBook extends Repository
{
    async getBookIds()
    {
        return  (await this.db
                    .createQueryBuilder(DbBook, 'book')
                    .select('book.id')
                    .orderBy({ displayOrder: 'ASC' })
                    .getMany())
                    .map(obj => obj.id);
    }

    async getFirstTopicLink(bookId: string)
    {
        let dbFirstTopic = await this.db.manager.findOne(DbTopic, { select: ['id', 'parts'], where: { previousId: null, bookId: bookId }});
        return dbFirstTopic ? link(dbFirstTopic.parts[0] as TopicType, dbFirstTopic.id) : null;
    }

    async getBookContributors(bookId: string)
    {
        let contributors = {};
        let contributorIds = await this.db.manager.find(DbTopicContributor, { select: ['contributorId'], where: { bookId: bookId }});
        
        if (!contributorIds)
            return contributors;

        contributorIds.forEach(dbContributor =>
        {
            let contributorId = dbContributor.contributorId;

            if (contributorId in contributors)
                contributors[contributorId]++;
            else
                contributors[contributorId] = 1;
        });

        return contributors;
    }

    async countBookTopics(bookId)
    {
        return await this.db.manager.count(DbTopic, { where: { bookId: bookId }});
    }
}