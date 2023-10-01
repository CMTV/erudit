import fs from "fs";
import path from "path";

import EruditProcess from "src/process/EruditProcess";
import DbContributor from "src/entity/contributor/db";

import { getAvatarExt, IDataContributorInfo } from "src/entity/contributor/data";
import { parseYamlFile } from "src/util";
import { Location, LocationType, Parser } from "translator";
import { readFile } from "src/util/io";
import { T_HELPER } from "src/translator/helper";
import { insertParseResult } from "src/translator/db";

export default class FillContributors extends EruditProcess
{
    name = 'Fill contributors';

    async do()
    {
        let dir = this.erudit.path.project('contributors');

        if (!fs.existsSync(dir))
            return;

        let contributorIds = fs.readdirSync(dir);
        for (let i = 0; i < contributorIds.length; i++)
        {
            let contributorId = contributorIds[i];

            this.startStage(`Contributor '${contributorId}'`);

            let filePath = (...parts: string[]) => path.join(dir, contributorId, ...parts);

            let files = fs.readdirSync(filePath());

            let dbContributor = new DbContributor;
                dbContributor.id = contributorId;
                dbContributor.avatarExt = getAvatarExt(files);

            if (files.includes('contributor.yml'))
            {
                let info = parseYamlFile(filePath('contributor.yml')) as IDataContributorInfo;

                dbContributor.name =          info.name;
                dbContributor.editor =        info.editor;
                dbContributor.displayName =   info.displayName;
                dbContributor.slogan =        info.slogan;
                dbContributor.links =         info.links;
            }

            if (files.includes('about.md'))
            {
                let location = new Location;
                    location.type = LocationType.Contributor;
                    location.path = dbContributor.id;

                let parser = new Parser(location, T_HELPER);
                let parseResult = await parser.parse(readFile(filePath('about.md')));

                dbContributor.about = parseResult.blocks;

                await insertParseResult(this.db, parseResult);
            }

            await this.db.manager.save(dbContributor);
        }
    }
}