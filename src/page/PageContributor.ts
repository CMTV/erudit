import { ViewContributionBook } from "src/process/build/page/BuildPageContributor";
import AsideMajor, { AsideMajorPane } from "./component/asideMajor/AsideMajor";
import SEO from "./component/SEO";
import Page from "./Page";

export default class PageContributor extends Page
{
    layout = 'contributor';
    asideMajor: AsideMajor;
    seo: SEO;

    hasStyle = true;
    hasScript = true;

    id: string;

    name: string;
    slogan: string;
    avatar: string;

    content: string;

    contribution: ViewContributionBook[];
    contributionCount: number;

    constructor()
    {
        super();

        let asideMajor = new AsideMajor;
            asideMajor.pane = AsideMajorPane.Pages;
        
        this.asideMajor = asideMajor;
    }

    getDest(): string
    {
        return `@contributor/${this.id}/index.html`;
    }
}