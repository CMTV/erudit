export default class View
{
    url: string;
    source: string;
    content: string;

    static isValid(viewLike: object)
    {
        if (!('source' in viewLike))
            return false;

        if (!('content' in viewLike))
            return false;

        return true;
    }
}