import path from "path";

export default class Path
{
    private packageRoot: string;
    private projectRoot: string;

    constructor(projectPath: string = '')
    {
        this.packageRoot = path.join(path.dirname(require.main.filename), '..');
        this.projectRoot = path.isAbsolute(projectPath) ? projectPath : path.join(path.resolve('.'), projectPath); 
    }

    package(...paths: string[])
    {
        return path.join(this.packageRoot, ...paths);
    }

    project(...paths: string[])
    {
        return path.join(this.projectRoot, ...paths);
    }

    //
    //
    //

    erudit(...paths: string[])
    {
        return this.project('.erudit', ...paths);
    }

    site(...paths: string[])
    {
        return this.project('.site', ...paths);
    }
}