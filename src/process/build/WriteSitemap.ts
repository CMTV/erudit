import { writeFile } from "src/util/io";
import EruditProcess from "../EruditProcess";

class Sitemap
{
    urls: string[];

    reset()
    {
        this.urls = [];
    }
}

export const SITEMAP = new Sitemap;

export class WriteSitemap extends EruditProcess
{
    name = 'Write sitemap';

    async do()
    {
        let urlsXml = '';

        SITEMAP.urls.forEach(url => urlsXml += `    <url><loc>${url}</loc></url>\n`);

        let sitemapXml = `

<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>

        `.trim();

        writeFile(this.erudit.path.site('sitemap.xml'), sitemapXml);
    }
}