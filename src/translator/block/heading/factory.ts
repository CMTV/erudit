import { EruditBlockFactory } from "src/translator/block/eruditBlock";
import Renderer, { RenderExtra } from "src/translator/Renderer";
import { transliterate } from "src/util/str";
import Heading from "./block";

export default class FHeading extends EruditBlockFactory<Heading>
{
    hasUniqueId: boolean;

    canParse(str: string)
    {
        return /^(#+) (.+)/.test(str);
    }
    
    protected parse(str: string)
    {
        this.hasUniqueId = !!this.blockMeta.id;

        let match = str.match(/^(#+) (.+)/);
        
        let heading = new Heading;
            heading.level = match[1].length;
            heading.title = this.parser.parseInliners(match[2]);

        return heading;
    }

    protected getIdPrefix(block)
    {
        return this.hasUniqueId ? super.getIdPrefix(block) : 'ah';
    }

    protected getIdContent(block: Heading)
    {
        if (this.hasUniqueId)
            return super.getIdContent(block);

        let id = RenderExtra.toPlainString(block.title);
            id = transliterate(id);
            id = id.replace(/[^\w\s.-]/g, '');
            id = id.trim();
            id = id.replace(/ +/g, '-');
        
        return id;
    }
}