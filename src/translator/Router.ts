export default class Router
{
    static getDirPath(location: string)
    {
        location = location.replace(/^@contributor/, 'contributors');
        return location;
    }
}