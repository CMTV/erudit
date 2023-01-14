import { TocItem } from "src/entity/toc/global";

export default class ViewTopicTocItem
{
    id:     string;
    icon:   string;
    level:  number;
    label:  string;

    static getIcon(type: string): string
    {
        switch (type)
        {
            case 'heading':     return 'hashtag';
            case 'important':   return 'exclamation';
            case 'definition':  return 'cube';
            case 'theorem':     return 'gavel';
            default: return 'NOICON';
        }
    }

    static makeListFrom(tocItems: TocItem[]): ViewTopicTocItem[]
    {
        function handleLevel(level: number, tocItems: TocItem[]): ViewTopicTocItem[]
        {
            let viewItems: ViewTopicTocItem[] = [];

            tocItems.forEach(tocItem =>
            {
                let viewItem = new ViewTopicTocItem;
                    viewItem.level = level;
                    viewItem.id = tocItem.id;
                    viewItem.icon = ViewTopicTocItem.getIcon(tocItem.type);
                    viewItem.label = tocItem.title;

                viewItems.push(viewItem);

                if (tocItem.children)
                    viewItems = viewItems.concat(handleLevel(level + 1, tocItem.children));
            });

            return viewItems;
        }

        return handleLevel(0, tocItems);
    }
}