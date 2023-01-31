import { CONFIG } from "src/config";
import { erudit } from "src/erudit";

import AsideMajor from "src/page/component/asideMajor/AsideMajor";
import SEO from "src/page/component/SEO";

export default abstract class Page
{
    abstract layout: string;
    abstract asideMajor: AsideMajor;
    abstract seo: SEO;

    abstract getDest(): string;

    hasStyle: boolean;
    hasScript: boolean;

    dest: string;
    singlePage: string;

    config = CONFIG;
    version = require(erudit.path.package('package.json')).version;

    bookId: string;
}