import { Block } from "bitran";
import imageSize from "image-size";
import { Helper, Location } from "translator";

import { erudit } from "src/erudit";
import { locationToDistPath, locationToSrcPath } from "src/entity/file/router";
import DbUnique from "src/entity/unique/db";

export class TranslatorHelper extends Helper
{
    isEditor() { return false; }

    async getParserFileSrc(location: Location): Promise<string>
    {
        return erudit.path.project(locationToSrcPath(location));
    }

    async getRenderFileSrc(location: Location): Promise<string>
    {
        return '/site/files/' + locationToDistPath(location);
    }

    async getImageSize(src: string): Promise<{ width: number; height: number; }>
    {
        return imageSize(src);
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