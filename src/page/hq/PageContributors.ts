import { ViewContributor } from "src/entity/contributor/view";
import SEO from "../component/SEO";
import AsideMajor, { AsideMajorPane } from "../component/asideMajor/AsideMajor";
import PageHQ from "./PageHQ";
import { link } from "src/router";

export default class PageContributors extends PageHQ
{
    layout = 'contributors';
    hqPage = 'contributors';
    
    hasStyle = true;

    editors: ViewContributor[];
    contributors: ViewContributor[];

    constructor()
    {
        super();

        this.seo = new SEO;
        this.seo.title = 'Участники | OMath';
        this.seo.desc = 'Люди, которые внесли свой вклад в проект.';
    }

    getDest(): string
    {
        return link('contributors', 'index.html');
    }
}