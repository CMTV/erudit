import chalk from "chalk";

import Location from "src/entity/location/global";
import DbRef from "src/entity/ref/db";
import RepoRef from "src/entity/ref/repository";
import DbUnique from "src/entity/unique/db";
import EruditProcess from "src/process/EruditProcess";
import { LinkRouter } from "src/translator/inliner/link/global";

/**
 * Warns if there are refs that lead to unknown uniques.
 * Also checks whether preview available for refs.
 */
export default class UniqueRefCheckout extends EruditProcess
{
    name = 'Uniques and refs checkout';

    async do()
    {
        let repo = new RepoRef(this.db);
        let refs = await repo.getRefs();
        let brokenArr: DbRef[] = [];

        for (let i = 0; i < refs.length; i++)
        {
            let ref = refs[i];
        
            let contextLocation = new Location;
                contextLocation.type = ref.from.split('/')[0].slice(1);
                contextLocation.id = ref.from.split('/').slice(1).join('/');

            let broken = false;
            let uniqueId = LinkRouter.getUniqueId(ref.target, contextLocation);

            if (uniqueId)
                broken = !(await this.db.manager.findOne(DbUnique, { where: { id: uniqueId }}));

            if (broken)
                brokenArr.push(ref);
  
            // ref.hasPreview =    !!unique?.content;
            // ref.broken =        !unique;

            this.db.manager.save(ref);
        }

        if (brokenArr.length > 0)
        {
            let brokenData = {};

            brokenArr.forEach(broken =>
            {
                if (!brokenData[broken.from])
                    brokenData[broken.from] = [];

                brokenData[broken.from].push(broken.target);
            });

            let warn = `Found ${chalk.whiteBright.bold.redBright(brokenArr.length)} broken ref${brokenArr.length > 1 ? 's' : ''}:\n\n`;

            Object.keys(brokenData).forEach(key =>
            {
                warn += chalk.gray('FROM') + ' ' + key + '\n';
                brokenData[key].forEach(value => warn += '  ' + chalk.gray('TO') + ' ' + value + '\n');

                warn += '\n';
            });

            warn = warn.slice(0, -2);

            this.warn(warn);
        }
    }
}