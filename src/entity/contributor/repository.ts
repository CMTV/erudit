import Repository from "src/db/Repository";
import DbTopicContributor from "../topicContributor/db";
import DbContributor from "./db";

export type TContributionData = { [bookId: string]: string[] };

export default class RepoContributor extends Repository
{
    async getContributorIds()
    {
        return (await this.db.manager.find(
            DbContributor,
            { select: { id: true } }
        )).map(dbContributor => dbContributor.id);
    }

    async getContributionData(contributorId: string): Promise<TContributionData>
    {
        let rawContributionData = await this.db.manager.find(
            DbTopicContributor,
            {
                select: { topicId: true, bookId: true},
                where: { contributorId: contributorId },
                order: { displayOrder: 'ASC' }
            }
        );

        let contributionData = {};

        rawContributionData.forEach(rawItem =>
        {
            contributionData[rawItem.bookId] = contributionData[rawItem.bookId] ?? [];
            contributionData[rawItem.bookId].push(rawItem.topicId);
        });

        return contributionData;
    }
}