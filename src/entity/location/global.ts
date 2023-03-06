import { throwMetaError } from "@cmtv/error-meta";

import { IdPrefix } from "src/entity/unique/global";

/**
 * Src/Dist independend location system.
 */
export default class Location
{
    type: string;
    id: string;
    target: string;

    toSrcPath()
    {
        switch (this.type)
        {
            case 'contributor':
                return `contributors/${this.id}/${this.target}`;

            case 'topic':
            case 'article':
            case 'summary':
            case 'practicum':
                return `books/${this.id}/${this.target}`;
        }

        return `${this.id}/${this.target}`;
    }

    toPath()
    {
        switch (this.type)
        {
            case 'contributor':
                return `contributors/${this.id}/${this.target}`;

            case 'topic':
                return `${this.id}/${this.target}`;

            case 'book':
            case 'article':
            case 'summary':
            case 'practicum':
                return `${this.id}/@${this.type}/${this.target ?? ''}`;
        }

        return `${this.id}/${this.target}`;
    }

    toString()
    {
        return `@${this.type}|${this.id}|${this.target ?? ''}`;
    }

    static fromString(strLocation: string): Location
    {
        let parts = strLocation.split('|');
        if (parts.length !== 3)
            throwMetaError(`Wrong number of parts in string location! Need 3, found ${parts.length}!`, { 'String location': strLocation });

        let location = new Location;
            location.type =     parts[0].startsWith('@') ? parts[0].slice(1) : parts[0];
            location.id =       parts[1];
            location.target =   parts[2];

        return location;
    }

    static fromShortString(str: string, strLocation: Location): Location
    {
        let parts = str.split('|');
        
        if (parts.length === 1)
            return Location.fromString(`@${strLocation.type}|${strLocation.id}|${str}`);

        if (parts.length === 2)
            return Location.fromString(`${parts[0]}|${strLocation.id}|${parts[1]}`);

        return Location.fromString(`${parts[0]}|${parts[1]}|${parts[2]}`);
    }

    //
    // OLD
    //

    /** @deprecated */
    makeFullIdFrom(id: string)
    {
        let idArr = id.split('/');

        let last = idArr[idArr.length - 1];
            last = last.split(':').map((item, i) => i === 0 ? IdPrefix.getPrefixFor(item) : item).join(':');

        idArr[idArr.length - 1] = last;

        if (idArr.length === 1)
            return this.getFullId() + '/' + idArr.join('/');

        if (idArr.length === 2)
            return `${idArr[0]}/${this.id}/${idArr[1]}`;

        return idArr.join('/');
    }

    /** @deprecated */
    getFullId()
    {
        return `@${this.type}/${this.id}`;
    }
}