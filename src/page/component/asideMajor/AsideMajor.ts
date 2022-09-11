import RepoGlobalToc from "src/entity/globalToc/repository";
import GlobalTocView from "src/entity/globalToc/view";
import { erudit } from "src/erudit";
import { BUILD_CACHE } from "src/process/build/BuildCache";

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
    globalToc: GlobalTocView;
    otherLinks: OtherLink[];
    singlePages: SinglePage[];

    constructor()
    {
        this.globalToc = BUILD_CACHE.gobalToc;
        this.otherLinks = BUILD_CACHE.otherLinks;
    }
}