import { CONFIG } from "src/config";
import { erudit } from "src/erudit";

export default abstract class Page
{
    abstract layout: string;
    abstract getDest(): string;

    id: string;
    dest: string;

    config = CONFIG;
    version = require(erudit.path.package('package.json')).version;

    pane = 'other'; // TODO: определяется самой страницей
}