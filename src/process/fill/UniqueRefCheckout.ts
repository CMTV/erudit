import chalk from "chalk";
import { Location, LocationType } from "translator";

import EruditProcess from "src/process/EruditProcess";

/**
 * Warns if there are refs that lead to unknown uniques.
 * Also checks whether preview available for refs.
 */
export default class UniqueRefCheckout extends EruditProcess
{
    name = 'Uniques and refs checkout';

    async do()
    {
        let brokenRefs = await this.db.query(`SELECT db_ref.target, db_ref."from" FROM db_ref LEFT JOIN db_unique ON db_ref.target = db_unique.id WHERE db_unique.id IS NULL`);
        let finalBrokenArr = [];

        for (let i = 0; i < brokenRefs.length; i++)
        {
            let brokenRef = brokenRefs[i];
            let targetLocation = Location.fromString(brokenRef.target);

            let broken = true;

            if (targetLocation.type === LocationType.Direct)
                broken = false;

            if (targetLocation.target === '')
                broken = false;

            if (broken)
                finalBrokenArr.push(brokenRef);
  
            // ref.hasPreview =    !!unique?.content;
            // ref.broken =        !unique;
        }

        if (finalBrokenArr.length > 0)
        {
            let brokenData = {};

            finalBrokenArr.forEach(broken =>
            {
                if (!brokenData[broken.from])
                    brokenData[broken.from] = [];

                brokenData[broken.from].push(broken.target);
            });

            let warn = `Found ${chalk.whiteBright.bold.redBright(finalBrokenArr.length)} broken ref${finalBrokenArr.length > 1 ? 's' : ''}:\n\n`;

            Object.keys(brokenData).forEach(key =>
            {
                let keyLocation = Location.fromString(key);
                    keyLocation.target = '';

                warn += chalk.gray('FROM') + ' ' + keyLocation.toString() + '\n';
                brokenData[key].forEach(value => warn += '  ' + chalk.gray('TO') + ' ' + value + '\n');

                warn += '\n';
            });

            warn = warn.slice(0, -2);

            this.warn(warn);
        }
    }
}