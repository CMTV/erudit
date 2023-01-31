import AsideMajor, { AsideMajorPane } from "src/page/component/asideMajor/AsideMajor";
import Page from "src/page/Page";
import SEO from "./component/SEO";

export default class PageIndex extends Page
{
    seo: SEO;
    layout = 'index';
    singlePage = 'home';

    asideMajor: AsideMajor;

    getDest = () => 'index.html';

    constructor()
    {
        super();

        let asideMajor = new AsideMajor;
            asideMajor.pane = AsideMajorPane.Toc;

        this.asideMajor = asideMajor;

        this.seo = new SEO;
        this.seo.title = 'Математика. Понятно, подробно, с примерами.';
    }
}