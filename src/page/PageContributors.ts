import { ViewContributor } from "src/entity/contributor/view";
import Page from "./Page";
import SEO from "./component/SEO";
import AsideMajor, { AsideMajorPane } from "./component/asideMajor/AsideMajor";

export default class PageContributors extends Page
{
    layout = 'contributors';
    singlePage = 'contributors';

    hasStyle = true;

    asideMajor: AsideMajor;
    seo: SEO;

    editors: ViewContributor[];
    contributors: ViewContributor[];

    constructor()
    {
        super();

        let asideMajor = new AsideMajor;
            asideMajor.pane = AsideMajorPane.Pages;

        this.asideMajor = asideMajor;

        this.seo = new SEO;
        this.seo.title = 'Участники | OMath';
        this.seo.desc = 'Список всех людей, которые внесли свой вклад в проект.';
    }

    getDest(): string
    {
        return `contributors/index.html`;
    }
}