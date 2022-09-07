import { DataSource } from "typeorm";
import { Block, Parser as BlpParser, Product } from "blp";
import { throwMetaError, withErrorMeta } from "@cmtv/error-meta";

import DbRef from "src/entity/ref/db";
import DbUnique from "src/entity/unique/db";
import DbFile from "src/entity/file/db";

// Block Factories
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

// Accent Blocks
import { FImportant, FTheorem } from "src/translator/block/accentBlock/factory";

// Inliner Factories
import FLink from "src/translator/inliner/link/factory";

// Parse Workers
import ParseWorker from "src/translator/parseWorker/ParseWorker";
import UniquePW from "src/translator/parseWorker/UniquePW";
import RefPW from "src/translator/parseWorker/RefPW";
import FilePW from "src/translator/parseWorker/FilePW";

//#region BLP Parser
//
//

export class EruditBlpParser extends BlpParser
{
    location: string;
}

let blpParser = new EruditBlpParser;

    blpParser.blockFactories = [
        FHeading,
        FList,
        FBlockList,
        FImage,
        FGallery,
        FRefAlias,
        FSpoiler,
        FTask,
        FInclude,
        FChunk,

        FImportant,
        FTheorem,

        FParagraph
    ];

    blpParser.inlineFactories = [
        FLink
    ];

//
//
//#endregion

export class ParseResult
{
    blocks:     Block[] =       [];
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
    parse(text: string, location: string): ParseResult
    {
        let parseResult = new ParseResult;

        let workers: ParseWorker[] = [
            new UniquePW,
            new RefPW,
            new FilePW
        ];

        workers.forEach(worker => worker.location = location);

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