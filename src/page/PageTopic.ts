import Page from "src/page/Page";
import AsideMajor, { AsideMajorPane } from "src/page/component/asideMajor/AsideMajor";
import ViewTopicTocItem from "src/entity/topicToc/view";
import SEO from "src/page/component/SEO";
import { ViewBaseContributor } from "src/entity/contributor/view";
import { ViewTodoItem } from "src/entity/todo/view";
import { link } from "src/router";
import { ViewTopicSource } from "src/entity/topicSourceRef/view";

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
    seo: SEO;

    hasStyle = true;
    hasScript = true;

    topicId: string;
    topicType: TopicType;
    topicTypes: TopicType[];

    bookId: string;
    bookTitle: string;
    bookToc: string;

    decoration: string;

    title: string;
    desc: string;
    content: string;

    advanced: boolean;
    wip: boolean;

    toc: ViewTopicTocItem[];

    next: string;
    previous: string;

    nextTitle: string;
    previousTitle: string;

    todos: ViewTodoItem[];

    contributors: ViewBaseContributor[];

    sources: ViewTopicSource[];

    constructor()
    {
        super();

        let asideMajor = new AsideMajor;
            asideMajor.pane = AsideMajorPane.Toc;
        
        this.asideMajor = asideMajor;
    }

    getDest()
    {
        return link(this.topicType, this.topicId, 'index.html');
    }
}