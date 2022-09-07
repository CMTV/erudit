import fs from "fs";
import path from "path";

import EruditProcess from "src/process/EruditProcess";
import DbContributor from "src/entity/contributor/db";

import { getAvatarExt, IDataContributorInfo } from "src/entity/contributor/data";
import { parseYamlFile } from "src/util";
import parser, { ParseResult } from "src/translator/Parser";

export default class FillContributors extends EruditProcess
{
    name = 'Fill contributors';

    async do()
    {
        let dir = this.erudit.path.project('contributors');

        if (!fs.existsSync(dir))
            return;

        let dbContributors: DbContributor[] = [];
        let parseResults: ParseResult[] = [];

        fs.readdirSync(dir).forEach(contributorId =>
        {
            this.startStage(`Contributor '${contributorId}'`);

            let filePath = (...parts: string[]) => path.join(dir, contributorId, ...parts);

            let files = fs.readdirSync(filePath());

            let dbContributor = new DbContributor;
                dbContributor.id = contributorId;
                dbContributor.avatarExt = getAvatarExt(files);

            if (files.includes('info.yml'))
            {
                let info = parseYamlFile(filePath('info.yml')) as IDataContributorInfo;

                dbContributor.name =          info.name;
                dbContributor.displayName =   info.displayName;
                dbContributor.slogan =        info.slogan;
                dbContributor.links =         info.links;
            }

            if (files.includes('about.md'))
            {
                let parseResult = parser.parse(
                    fs.readFileSync(filePath('about.md'), 'utf-8'),
                    '@contributor/' + dbContributor.id
                );

                parseResults.push(parseResult);
                dbContributor.about = parseResult.blocks;
            }

            dbContributors.push(dbContributor);
        });

        this.startStage(`Inserting contributors into database`);

        await this.db
                    .createQueryBuilder()
                    .insert()
                    .into(DbContributor)
                    .values(dbContributors)
                    .execute();

        await ParseResult.insert(parseResults, this.db);
    }
}