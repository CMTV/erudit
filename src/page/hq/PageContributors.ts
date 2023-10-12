import { ViewContributor } from "src/entity/contributor/view";
import SEO from "../component/SEO";
import AsideMajor, { AsideMajorPane } from "../component/asideMajor/AsideMajor";
import PageHQ from "./PageHQ";

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
        this.seo.desc = 'Список всех людей, которые внесли свой вклад в проект.';
    }

    getDest(): string
    {
        return `contributors/index.html`;
    }
}