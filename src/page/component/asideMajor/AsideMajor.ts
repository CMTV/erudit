import { erudit } from "src/erudit";

import OtherLink from "./OtherLink";
import SinglePage from "./SinglePage";

export enum AsideMajorPane
{
    Toc =       'toc',
    Pages =     'pages',
    Search =    'search',
    Language =  'language',
    Other =     'other'
}

export default class AsideMajor
{
    pane: AsideMajorPane;
    otherLinks: OtherLink[];
    singlePages: SinglePage[];

    constructor()
    {
        // TODO: Убрать генерацию каждый раз. Достаточно сделать это один раз за всю генерацию сайта.
        this.otherLinks = OtherLink.fromRaw(erudit.pConfig.links);
    }
}