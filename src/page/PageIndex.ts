import AsideMajor, { AsideMajorPane } from "src/page/component/asideMajor/AsideMajor";
import Page from "src/page/Page";
import SEO from "./component/SEO";
import DbBook from "src/entity/book/db";
import { erudit } from "src/erudit";

export default class PageIndex extends Page
{
    seo: SEO;
    layout = 'index';
    singlePage = 'home';

    hasStyle = true;
    hasScript = true;

    asideMajor: AsideMajor;

    wipBooks: DbBook[];

    getDest = () => '/index.html';

    constructor()
    {
        super();

        let asideMajor = new AsideMajor;
            asideMajor.pane = AsideMajorPane.Toc;

        this.asideMajor = asideMajor;

        this.seo = new SEO;
        this.seo.title = erudit.lang.phrase('global.siteName');
        this.seo.desc = 'Лучшие учебники по математике! Теория, конспекты и задачник в одном флаконе.';
    }
}