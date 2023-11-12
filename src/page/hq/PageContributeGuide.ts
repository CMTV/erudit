import { link } from "src/router";
import SEO from "../component/SEO";
import PageHQ from "./PageHQ";

export default class PageContributeGuide extends PageHQ
{
    layout = 'contributeGuide';
    hqPage = 'contribute-guide';

    hasStyle = true;

    constructor()
    {
        super();

        this.seo = new SEO;
        this.seo.title = 'Как внести вклад? | OMath';
        this.seo.desc = '';
    }

    getDest(): string
    {
        return link('guide', 'index.html');
    }
}