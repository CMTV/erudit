import { CONFIG } from "src/config";
import { erudit } from "src/erudit";

import AsideMajor from "src/page/component/asideMajor/AsideMajor";

export default abstract class Page
{
    abstract layout: string;
    abstract asideMajor: AsideMajor;

    abstract getDest(): string;

    dest: string;
    singlePage: string;

    config = CONFIG;
    version = require(erudit.path.package('package.json')).version;

    // FAST NEW YEAR DEPLOY PARAMS

    bookId: string;
}