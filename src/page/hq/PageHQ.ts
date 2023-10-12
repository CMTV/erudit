import Page from "../Page";
import SEO from "../component/SEO";
import AsideMajor, { AsideMajorPane } from "../component/asideMajor/AsideMajor";

export default abstract class PageHQ extends Page
{
    abstract hqPage: string;

    singlePage = 'hq';

    asideMajor: AsideMajor;
    seo: SEO;

    constructor()
    {
        super();

        let asideMajor = new AsideMajor;
            asideMajor.pane = AsideMajorPane.Pages;

        this.asideMajor = asideMajor;
    }
}