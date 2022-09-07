import { throwMetaError } from "@cmtv/error-meta";
import sizeOf from "image-size";

import { erudit } from "src/erudit";
import { EruditBlockObjFactory } from "src/translator/block/eruditBlock";
import { EruditBlpParser } from "src/translator/Parser";
import Router from "src/translator/Router";

import Image from "./block";

export default class FImage extends EruditBlockObjFactory<Image>
{
    objType = 'image';
    parser: EruditBlpParser;

    parseObj(obj: any): Image
    {
        let image = new Image;

        if (!obj.src)
            throwMetaError(`Image 'src' property is not set!`, { 'Image data': obj });

        image.src = obj.src.startsWith('/') ? obj.src.slice(1) : Router.getDirPath(this.parser.location + '/' + obj.src);
        
        try
        {
            let dimensions = sizeOf(erudit.path.project(image.src));
            image.width = dimensions.width;
            image.height = dimensions.height;
        }
        catch (e) { throwMetaError(`Image can't be loaded!`, { 'Image': image.src }); }

        image.caption = obj.caption;

        return image;
    }
}