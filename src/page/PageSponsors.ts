import Page from "./Page";
import SEO from "./component/SEO";
import AsideMajor, { AsideMajorPane } from "./component/asideMajor/AsideMajor";
import { Sponsor } from "src/entity/sponsor/global";

export default class PageSponsors extends Page
{
    layout = 'sponsors';
    singlePage = 'sponsors';
    asideMajor: AsideMajor;
    seo: SEO;

    hasStyle = true;
    hasScript = true;

    tier3:      Sponsor[] = [];
    tier2:      Sponsor[] = [];
    tier1:      Sponsor[] = [];
    retired:    Sponsor[] = [];

    constructor()
    {
        super();

        let asideMajor = new AsideMajor;
            asideMajor.pane = AsideMajorPane.Pages;

        this.asideMajor = asideMajor;

        this.seo = new SEO;
        this.seo.title = 'Спонсоры | OMath';
        this.seo.desc = 'Люди, которые финансово поддерживают проект.'
    }

    getDest(): string
    {
        return `sponsors/index.html`;
    }
}