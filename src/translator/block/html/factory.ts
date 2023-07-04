import { EruditBlockFactory } from "../eruditBlock";
import Html from "./block";

export default class FHtml extends EruditBlockFactory<Html>
{
    canParse(str: string)
    {
        return str.startsWith('<') && str.endsWith('>');
    }

    protected parse(str: string): Html
    {
        let id = 0;

        let html = new Html;
            html.inliners = {};
            html.content = str.replace(/(>)([^<]*)(<)/gm, (match, start, content, end) =>
            {                
                if (content.trim() === '')
                    return start + end;

                id++;

                html.inliners[id] = this.parser.parseInliners(content);
                return start + `{{{${id}}}}` + end;
            });
        
        return html;
    }
}