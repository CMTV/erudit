import { CONFIG } from "src/config";
import { writeFile } from "src/util/io";
import EruditProcess from "../EruditProcess";

export class WriteRobots extends EruditProcess
{
    name = 'Write robots.txt';

    async do()
    {
        let content = `

User-agent: *
Allow: /

Sitemap: ${CONFIG.getUrl()}/sitemap.xml

        `.trim();

        writeFile(this.erudit.path.site('robots.txt'), content);
    }
}