import { EruditBlockFactory } from "src/translator/block/eruditBlock";
import Paragraph from "./block";

export default class FParagraph extends EruditBlockFactory<Paragraph>
{
    canParse()
    {
        return true;
    }

    protected parse(str: string)
    {
        let paragraph = new Paragraph;
            paragraph.content = this.parser.parseInliners(str);

        return paragraph;
    }
}