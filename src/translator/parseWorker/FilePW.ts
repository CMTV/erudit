import { Block, Inliner } from "blp";

import DbFile from "src/entity/file/db";
import { ParseResult } from "src/translator/Parser";
import Image from "src/translator/block/image/block";
import Gallery from "src/translator/block/gallery/block";

import ParseWorker from "./ParseWorker";

export default class FilePW extends ParseWorker
{
    filesToAdd = {};
    files: DbFile[] = [];

    step(product: Block | Inliner)
    {
        if (product instanceof Image)
            this.filesToAdd[product.src] = null;

        if (product instanceof Gallery)
            product.images.forEach(image => this.filesToAdd[image.src] = null);
    }

    finally()
    {
        Object.keys(this.filesToAdd).forEach((key, i) =>
        {
            let file = new DbFile;
                file.src = key;
                file.location = this.location;

            this.files.push(file);
        });
    }

    applyTo(parseResult: ParseResult)
    {
        parseResult.files = [...this.files];
    }
}