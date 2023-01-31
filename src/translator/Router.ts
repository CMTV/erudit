import Location from "src/entity/location/global";

export default class Router
{
    static getSrcPath(location: Location)
    {
        
    }

    static getDistPath(location: Location)
    {

    }

    static getDirPath(location: string)
    {
        location = location.replace(/^@contributor/, 'contributors');
        location = location.replace(/^@article/, 'books');

        return location;
    }
}