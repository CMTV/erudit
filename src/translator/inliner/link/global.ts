import Location from "src/entity/location/global";
import DbUnique from "src/entity/unique/db";
import { IdPrefix } from "src/entity/unique/global";
import { erudit } from "src/erudit";

export enum LinkType
{
    Unknown,
    External,
    Absolute,
    Page,
    Unique
}

export class LinkRouter
{
    static getLinkType(link: string): LinkType
    {
        if (/^https?:\/\//.test(link))
            return LinkType.External;
        
        if (link.startsWith('/'))
            return LinkType.Absolute;

        if (link.startsWith('@'))
        {
            let linkArr = link.split('/');
            let last = linkArr[linkArr.length - 1];

            return last.indexOf(':') === -1 ? LinkType.Page : LinkType.Unique;
        }

        if (link.indexOf(':') !== -1)
            return LinkType.Unique;

        return LinkType.Unknown;
    }

    static getUniqueId(link: string, contextLocation: Location)
    {
        let type = this.getLinkType(link);
        let linkArr = link.split('/');

        if (type !== LinkType.Unique)
            return null;

        let location = new Location;
            location.type = link.startsWith('@') ? linkArr[0].slice(1) : contextLocation.type;
            location.id = linkArr.length < 3 ? contextLocation.id : linkArr.slice(1, -1).join('/');

        return `@${location.type}/${location.id}/${this.normilizeUniqueId(linkArr[linkArr.length - 1], ':')}`;
    }

    static async getViewData(link: string, contextLocation: Location): Promise<{ href: string, preview?: string }>
    {
        let type = this.getLinkType(link);

        switch (type)
        {
            case LinkType.External:
            case LinkType.Absolute:
                return { href: link };
        }

        let linkArr = link.split('/');

        let location = new Location;
            location.type = link.startsWith('@') ? linkArr[0].slice(1) : contextLocation.type;

        if (type === LinkType.Page)
        {
            location.id = linkArr.length === 1 ? contextLocation.id : linkArr.slice(1).join('/');
            return { href: '/' + location.toPath() };
        }

        if (type === LinkType.Unique)
        {
            let linkTarget = this.normilizeUniqueId(linkArr[linkArr.length - 1], ':');
            location.id = linkArr.length < 3 ? contextLocation.id : linkArr.slice(1, -1).join('/');

            let href = '/' + location.toPath() + '#' + linkTarget;

            let preview = undefined;
            let hasPreview = await erudit.db.manager.findOne(DbUnique, { where: { id: `@${location.type}/${location.id}/${linkTarget}` } });

            if (hasPreview)
                preview = `/site/uniques/@${location.type}/${location.id}/${this.normilizeUniqueId(linkTarget, '_')}.html`;

            return { href: href, preview: preview };
        }

        return null;
    }

    protected static normilizeUniqueId(id: string, sep: string)
    {
        let uniqueId = id;
            uniqueId = uniqueId.split(':').map((part, i) =>
            {
                return i === 0 ? IdPrefix.getPrefixFor(part) : part
            }).join(sep);
        
        return uniqueId;
    }
}