import { DataSource } from "typeorm";
import { Block, Parser as BlpParser, Product } from "blp";
import { throwMetaError, withErrorMeta } from "@cmtv/error-meta";

import DbRef from "src/entity/ref/db";
import DbUnique from "src/entity/unique/db";
import DbFile from "src/entity/file/db";

import Location from "src/entity/location/global";

// Block Factories
import { default as FBlockMath } from "src/translator/block/math/factory";
import FHeading from "src/translator/block/heading/factory";
import { FList, FBlockList } from "src/translator/block/list/factory";
import FImage from "src/translator/block/image/factory";
import FGallery from "src/translator/block/gallery/factory";
import FRefAlias from "src/translator/block/refAlias/factory";
import FSpoiler from "src/translator/block/spoiler/factory";
import FTask from "src/translator/block/task/factory";
import FInclude, { getChunkUniques } from "src/translator/block/include/factory";
import FChunk from "src/translator/block/chunk/factory";
import FParagraph from "src/translator/block/paragraph/factory";
import FHr from "src/translator/block/hr/factory";
import FHtml from "./block/html/factory";
import FTable from "./block/table/factory";

// Accent Blocks
import { FDefinition, FExample, FImportant, FTheorem } from "src/translator/block/accentBlock/factory";

// Inliner Factories
import { default as FInlineMath } from "src/translator/inliner/math/factory";
import FLink from "src/translator/inliner/link/factory";

// Parse Workers
import ParseWorker from "src/translator/parseWorker/ParseWorker";
import UniquePW from "src/translator/parseWorker/UniquePW";
import RefPW from "src/translator/parseWorker/RefPW";
import FilePW from "src/translator/parseWorker/FilePW";
import { EruditBlock } from "./block/eruditBlock";
import StatsPW from "./parseWorker/StatsPW";

//#region BLP Parser
//
//

export class EruditBlpParser extends BlpParser
{
    location: Location;
}

let blpParser = new EruditBlpParser;

    blpParser.blockFactories = [
        FBlockMath,

        FHeading,
        FHr,
        FList,
        FBlockList,
        
        FImage,
        FGallery,
        FRefAlias,
        FSpoiler,
        FTask,
        FTable,

        FInclude,
        FChunk,

        FImportant,
        FExample,
        FDefinition,
        FTheorem,

        FHtml,
        FParagraph
    ];

    blpParser.inlineFactories = [
        FInlineMath,
        FLink
    ];

//
//
//#endregion

export class ParseResult
{
    blocks:     EruditBlock[] =       [];
    uniques:    DbUnique[] =    [];
    refs:       DbRef[] =       [];
    files:      DbFile[] =      [];
    // searchables

    static async insert(parseResults: ParseResult[], db: DataSource)
    {
        let uniques: DbUnique[] = [];
        let refs: DbRef[] = [];
        let files: DbFile[] = [];

        parseResults.forEach(parseResult =>
        {
            uniques =   uniques.concat(parseResult.uniques);
            refs =      refs.concat(parseResult.refs);
            files =     files.concat(parseResult.files);
        });

        // Uniques
    
        for (let i = 0; i < uniques.length; i++)
        {
            let unique = uniques[i];

            await db
                    .createQueryBuilder()
                    .insert()
                    .into(DbUnique)
                    .values(unique)
                    .execute()
                    .catch(e => {
                        throwMetaError('Failed to insert unique!', {
                            Unique: unique.id,
                            Error: e
                        });
                    });
        }

        // Refs

        await db
                .createQueryBuilder()
                .insert()
                .orIgnore()
                .into(DbRef)
                .values(refs)
                .execute();

        // Files

        await db
                .createQueryBuilder()
                .insert()
                .orIgnore()
                .into(DbFile)
                .values(files)
                .execute();

    }
}

class Parser
{
    parse(text: string, location: Location, extra = {}): ParseResult
    {
        let parseResult = new ParseResult;

        let workers: ParseWorker[] = [
            new UniquePW,
            new RefPW,
            new FilePW,
            new StatsPW
        ];

        workers.forEach(worker => {
            worker.location = location,
            worker.extra = extra
        });

        withErrorMeta(() =>
        {            
            blpParser.fabricateCb = (product, factory) =>
            {
                //
                // !!! Bottleneck! Potential mess with multiple of ParseWorkers return their value and rewriting the previous result !!!
                //

                let result;
                workers.forEach(worker =>
                {
                    let stepResult = worker.step(product, factory);
                    if (typeof stepResult !== 'undefined')
                        result = stepResult;
                });

                return result;
            };

            blpParser.productCb = (products: Product[]) =>
            {
                let chunkUniques = getChunkUniques(products, location);
                parseResult.uniques = parseResult.uniques.concat(chunkUniques);

                return products;
            }

            blpParser.location = location;
            parseResult.blocks = blpParser.parseBlocks(text);
            blpParser.location = null;

            workers.forEach(worker =>
            {
                worker.finally();
                worker.applyTo(parseResult);
            });

        }, { Location: location });

        return parseResult;
    }
}

let parser = new Parser;

export default parser;