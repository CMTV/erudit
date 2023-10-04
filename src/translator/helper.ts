import { Block } from "bitran";
import imageSize from "image-size";
import { Helper, Location } from "translator";

import { erudit } from "src/erudit";
import { locationToDistPath, locationToSrcPath } from "src/entity/file/router";
import DbUnique from "src/entity/unique/db";
import { exists } from "src/util/io";

export class TranslatorHelper extends Helper
{
    isEditor() { return false; }

    async hasImage(location: Location): Promise<boolean>
    {
        return exists(erudit.path.project(locationToSrcPath(location)));
    }

    async getImageSrc(location: Location): Promise<string>
    {
        return '/site/files/' + locationToDistPath(location);
    }

    async getImageSize(location: Location): Promise<{ width: number; height: number; }>
    {
        return imageSize(erudit.path.project(locationToSrcPath(location)));
    }

    async getUnique(id: string): Promise<Block[]>
    {
        let dbUnique = await erudit.db.manager.findOne(DbUnique, { where: { id: id } });
        return dbUnique.content;
    }

    i18n(phrase: string): string
    {
        return erudit.lang.phrase('content.' + phrase);
    }
}

export let T_HELPER = new TranslatorHelper;