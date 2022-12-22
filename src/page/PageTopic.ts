import Page from "src/page/Page";
import AsideMajor, { AsideMajorPane } from "src/page/component/asideMajor/AsideMajor";

export enum TopicType
{
    Article = 'article',
    Summary = 'summary',
    Practicum = 'practicum'
}

export default class PageTopic extends Page
{
    layout = 'topic';
    asideMajor: AsideMajor;

    topicId: string;
    topicType: TopicType;

    title: string;
    content: string;
    // TODO: topicToc

    constructor()
    {
        super();

        let asideMajor = new AsideMajor;
            asideMajor.pane = AsideMajorPane.Toc;
        
        this.asideMajor = asideMajor;
    }

    getDest()
    {
        return this.topicId + '/@' + this.topicType + '/index.html';
    }
}

//
// НА ЗАВТРА
// ГЕНЕРАЦИЯ МЕНЮ ДЛЯ КАЖДОГО УЧЕБНИКА
//