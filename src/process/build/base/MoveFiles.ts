import DbFile from "src/entity/file/db";
import Location from "src/entity/location/global";
import EruditProcess from "src/process/EruditProcess";
import { copyFile } from "src/util/io";

export default class MoveFiles extends EruditProcess
{
    name = 'Move files';

    async do()
    {
        let files = (await this.db.manager.find(DbFile)).map(dbFile => dbFile.src);
        
        files.forEach(file =>
        {
            let location = Location.fromString(file);

            let srcPath = this.erudit.path.project(location.toSrcPath());
            let destPath = this.erudit.path.site('site', 'files', location.toPath());

            copyFile(srcPath, destPath);
        });
    }
}