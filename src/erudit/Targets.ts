export default class Targets
{
    hasAny: boolean;

    pages: string[] = [];
    paths: string[] = [];

    constructor(targets: string[])
    {
        this.hasAny = targets && targets.length > 0;

        if (this.hasAny)
        {
            targets.forEach(target =>
            {
                if (target.startsWith('@'))
                    this.pages.push(target.substring(1));
                else
                    this.paths.push(target);
            });
        }
    }

    bookAllowed(bookId: string)
    {
        if (!this.hasAny)
            return true;

        for (let i = 0; i < this.paths.length; i++)
            if (this.paths[i].startsWith(bookId))
                return true;
            
        return false;
    }

    pathAllowed(path: string)
    {
        return this.anyAllowed(path, this.paths);
    }

    pageAllowed(page: string)
    {
        return this.anyAllowed(page, this.pages);
    }

    private anyAllowed(path: string, arr: string[])
    {
        if (!this.hasAny)
            return true;

        if (path.at(-1) === '/')
            path = path.slice(0, -1);

        for (let i = 0; i < arr.length; i++)
            if (path === arr[i] || path.startsWith(arr[i] + '/'))
                return true;

        return false;
    }
}