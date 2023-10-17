import { BookRefItem, BookRefType } from "./global";

function typeToIcon(type: BookRefType): string
{
    switch (type)
    {
        case BookRefType.Book:      return 'book';
        case BookRefType.Article:   return 'file-lines';
        case BookRefType.Site:      return 'globe';
        default:                    return 'arrow-right';
    }
}

export class ViewBookRefItem extends BookRefItem
{
    icon: string;

    static fromRef(ref: BookRefItem)
    {
        let view = new ViewBookRefItem;
            view =      {...view, ...ref};
            view.icon = typeToIcon(ref.type);

        if (view.refs)
            view.refs = view.refs.map(subRef => this.fromRef(subRef));

        return view;
    }
}