import { Paragraph } from "blp";
import { EruditBlockFactory, EruditBlockObjFactory } from "src/translator/block/eruditBlock";
import List from "./block";

export class FList extends EruditBlockFactory<List>
{
    canParse(str: string)
    {
        return this.isUl(str) || this.isOl(str) !== null;
    }

    parse(str: string): List
    {
        let list = new List;
            list.type = this.isUl(str) ? 'ul' : 'ol';
            list.items = [];

        if (list.type === 'ol')
            list.olStart = +this.isOl(str);

        str.split('\n').map(line => line.trim()).forEach(line =>
        {
            let start = list.type === 'ul' ? 2 : this.isOl(line).length + 2;
            let inliners = this.parser.parseInliners(line.slice(start));
            let paragraph = new Paragraph;
                paragraph.content = inliners;

            list.items.push([paragraph]);
        });
        
        return list;
    }

    isUl(str: string)
    {
        return str.startsWith('* ');       
    }

    isOl(str: string): string
    {
        let match = str.match(/^(\d+). /);

        if (match)
            return match[1];

        return null;
    }
}

export class FBlockList extends EruditBlockObjFactory<List>
{
    objType = 'list';

    protected parseObj(obj: any): List
    {
        let list = new List;
            list.type = ['ul', 'ol'].includes(obj.type) ? obj.type : 'ul';
    
        if (list.type === 'ol')
        {
            let start = Math.floor(obj.start);
                start = isNaN(start) ? 1 : start;

            list.olStart = start;
        }

        if (!Array.isArray(obj.items) || obj.items.length === 0)
            return null;

        list.items = obj.items.map(item => this.parser.parseBlocks(item));

        return list;
    }
}