import { CONFIG } from "src/config";
import { erudit } from "src/erudit";
import Layout from "src/frontend/Layout";

import AsideMajor from "src/page/component/asideMajor/AsideMajor";
import SEO from "src/page/component/SEO";
import { SITEMAP } from "src/process/build/WriteSitemap";

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

    compile()
    {
        let dest = this.getDest();
        SITEMAP.urls.push(CONFIG.getUrl() + '/' + dest.replace('index.html', ''));
        Layout.compileFile(`page/${this.layout}.pug`, dest, this);
    }
}