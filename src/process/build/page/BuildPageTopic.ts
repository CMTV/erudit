import DbTopic from "src/entity/topic/db";
import RepoTopic from "src/entity/topic/repository";
import Layout from "src/frontend/Layout";
import PageTopic, { TopicType } from "src/page/PageTopic";
import EruditProcess from "src/process/EruditProcess";

export default class BuildPageTopic extends EruditProcess
{
    name = 'Build topic pages';

    async do()
    {
        let topicIds = await (new RepoTopic(this.db)).getTopicIds();

        for (let i = 0; i < topicIds.length; i++)
        {
            let topicId = topicIds[i];
            let dbTopic = await this.db.manager.findOne(DbTopic, { where: { id: topicId }});

            Object.values(TopicType).forEach(type =>
            {
                if (!dbTopic[type]) return;

                let page = new PageTopic;
                    page.topicType = type;
                    page.topicId = topicId;
                    page.bookId = dbTopic.bookId;

                    page.title = dbTopic.title;
                    page.content = dbTopic[type];

                // Один общий метод compilePage (вдруг надо будет больше действий?)
                Layout.compile(`page/${page.layout}.pug`, page, page.getDest());
            });
        }        
    }
}