import { erudit } from "src/erudit";
import { IProjectConfig } from "src/erudit/config";

export class Config
{
    url:        string;
    dev:        boolean;
    buildTime:  number;

    constructor()
    {
        this.buildTime = Date.now();
    }

    getUrl()
    {
        return this.dev ? 'http://localhost:3000' : this.url;
    }

    static makeConfig(pConfig: IProjectConfig): Config
    {
        let config = new Config;

        config.dev = erudit.dev;
        config.url = pConfig.url;

        return config;
    }
}

export let CONFIG = new Config;
export function SET_CONFIG(config: Config) { CONFIG = config; }