import { ParseResult } from "translator";
import { DataSource } from "typeorm/browser";

import DbUnique from "src/entity/unique/db";
import DbRef from "src/entity/ref/db";
import DbFile from "src/entity/file/db";
import { throwMetaError } from "@cmtv/error-meta";

export async function insertParseResult(db: DataSource, ...parseResults: ParseResult[])
{
    let uniques:    DbUnique[] =    parseResults.map(result => result.uniques).flat() as DbUnique[];
    let refs:       DbRef[] =       [];
    let files:      DbFile[] =      [];

    {
        // Refs
        parseResults.forEach(result => {
            result.refs.forEach(ref =>
            {
                let dbRef = new DbRef;
                    dbRef.from =    result.locaiton.toString();
                    dbRef.target =  ref;

                refs.push(dbRef);
            });
        });
    }

    {
        // Files
        let fileSrcList = parseResults.map(result => result.files).flat();
            fileSrcList.forEach(fileSrc =>
            {
                let dbFile = new DbFile;
                    dbFile.src = fileSrc;
                
                files.push(dbFile);
            });
    }

    let insert = async (label: string, into, values, ignore = false) =>
    {
        let query = db
                    .createQueryBuilder()
                    .insert()
                    .into(into)
                    .values(values);
        
        if (ignore)
            query = query.orIgnore();

        return query.execute().catch(e => throwMetaError(`Failed to insert ${label}!`, { Error: e }));
    }

    return Promise.all([
        insert('unique', DbUnique, uniques),
        insert('ref', DbRef, refs),
        insert('file', DbFile, files, true)
    ]);
}