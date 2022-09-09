import AsideMajor, { AsideMajorPane } from "src/page/component/asideMajor/AsideMajor";
import Page from "src/page/Page";

export default class PageIndex extends Page
{
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
    }
}