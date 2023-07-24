import { throwMetaError } from "@cmtv/error-meta";
import sizeOf from "image-size";
import Location from "src/entity/location/global";

import { erudit } from "src/erudit";
import { EruditBlockObjFactory } from "src/translator/block/eruditBlock";
import { EruditBlpParser } from "src/translator/Parser";

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

        let location = Location.fromShortString(obj.src, this.parser.location);
        
        if (['article', 'summary', 'practicum'].includes(location.type))
            location.type = 'topic';

        image.src = location.toString();

        let srcPath = location.toSrcPath();

        try
        {
            let dimensions = sizeOf(erudit.path.project(srcPath));
            image.width = dimensions.width;
            image.height = dimensions.height;
        }
        catch (e) { throwMetaError(`Image can't be loaded!`, { 'Image': srcPath }); }

        image.caption = obj.caption;
        image.invertible = obj.invertible;

        if (obj._classList)
            image._classList = obj._classList;

        image.minWidth ??= obj.minWidth
        image.maxWidth ??= obj.maxWidth
        
        if (obj.width)
            image.minWidth = image.maxWidth = obj.width;

        return image;
    }
}