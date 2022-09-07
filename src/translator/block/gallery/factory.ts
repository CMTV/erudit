import { throwMetaError, withErrorMeta } from "@cmtv/error-meta";

import { EruditBlockObjFactory } from "src/translator/block/eruditBlock";
import FImage from "src/translator/block/image/factory";
import Gallery from "./block";

export default class FGallery extends EruditBlockObjFactory<Gallery>
{
    objType = 'gallery';

    parseObj(obj: any)
    {
        let gallery = new Gallery;

        if (!obj.images)
            throwMetaError(`Gallery must have an 'images' property!`, { 'Gallery data': obj });

        if (!Array.isArray(obj.images))
            throwMetaError(`Gallery 'images' property must be an array!`, { 'Gallery data': obj });

        gallery.images = [];
        obj.images.forEach(image => withErrorMeta(() =>
        {
            let factory = new FImage(this.parser);
            gallery.images.push(factory.fabricate(image));
        }, { 'Gallery data': obj }));

        gallery.showInRow = obj.showInRow ?? 0;

        return gallery;
    }
}