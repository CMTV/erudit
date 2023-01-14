import { EruditBlockFactory } from "src/translator/block/eruditBlock";
import Renderer, { RenderExtra } from "src/translator/Renderer";
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

let a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};

function transliterate(word: string)
{
    return word.split('').map(char => a[char] || char).join('');
}