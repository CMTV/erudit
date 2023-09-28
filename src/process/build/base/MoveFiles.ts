import DbFile from "src/entity/file/db";
import { locationToDistPath, locationToSrcPath } from "src/entity/file/router";
import EruditProcess from "src/process/EruditProcess";
import { copyFile } from "src/util/io";
import { Location } from "translator";

export default class MoveFiles extends EruditProcess
{
    name = 'Move files';

    async do()
    {
        let fileLocations = (await this.db.manager.find(DbFile)).map(dbFile => dbFile.src);
        
        for (let i = 0; i < fileLocations.length; i++)
        {
            let fileLocation = fileLocations[i];
            let location = Location.fromString(fileLocation);

            let srcPath = this.erudit.path.project(locationToSrcPath(location));
            let destPath = this.erudit.path.site('site', 'files', locationToDistPath(location));

            copyFile(srcPath, destPath);
        }
    }
}