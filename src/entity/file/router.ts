import { Location, LocationType } from "translator";

export function locationToSrcPath(location: Location)
{
    let path = '';

    switch (location.type)
    {
        case LocationType.Direct:
            return location.path;

        case LocationType.Contributor:
            path = `contributors/${location.path}/${location.target}`;
            break;

        case LocationType.Topic:
        case LocationType.Article:
        case LocationType.Summary:
        case LocationType.Practicum:
            path = `books/${location.path}/${location.target}`;
            break;
    }

    return path;
}

export function locationToDistPath(location: Location)
{
    let path = '';

    switch (location.type)
    {
        case LocationType.Direct:
            return location.path;

        case LocationType.Contributor:
            path = `contributors/${location.path}/${location.target}`;
            break;

        case LocationType.Topic:
        case LocationType.Article:
        case LocationType.Summary:
        case LocationType.Practicum:
            path = `${location.path}/${location.target}`;
            break;
    }

    return path;
}