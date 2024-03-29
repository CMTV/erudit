import Page from "src/page/Page";
import AsideMajor, { AsideMajorPane } from "src/page/component/asideMajor/AsideMajor";
import SEO from "src/page/component/SEO";
import { ViewBaseContributor } from "src/entity/contributor/view";
import { BookWipItem } from "src/entity/book/global";
import { link } from "src/router";
import { ViewBookSource } from "src/entity/bookSource/view";

export default class PageBook extends Page
{
    layout = 'book';
    asideMajor: AsideMajor;
    seo: SEO;

    hasStyle = true;
    hasScript = true;

    topicCount: number;
    definitions: number;
    theorems: number;
    tasks: number;

    bookId: string;
    bookTitle: string;
    bookToc: string;

    decoration: string;

    firstTopicLink: string;
    contributors: ViewBaseContributor[];

    desc: string;
    results: string[];
    topics: string[];

    wipItems: BookWipItem[];

    sources: ViewBookSource[];

    constructor()
    {
        super();

        let asideMajor = new AsideMajor;
            asideMajor.pane = AsideMajorPane.Toc;

        this.asideMajor = asideMajor;
    }

    getDest(): string
    {
        return link('book', this.bookId, 'index.html');
    }
}