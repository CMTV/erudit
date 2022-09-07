export class Config
{
    url = 'https://omath.net'; // TODO: Брать из конфига. Оттуда же из конфига генерить и файл CNAME!!!
    dev: boolean;
    buildTime: number;

    constructor()
    {
        this.buildTime = Date.now();
    }

    getUrl()
    {
        return this.dev ? 'http://localhost:3000' : this.url;
    }
}

export let CONFIG = new Config;
export function SET_CONFIG(config: Config) { CONFIG = config; }