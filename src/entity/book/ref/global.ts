export enum BookRefType
{
    Book =      'book',
    Article =   'article',
    Site =      'site',
}

export class BookRefItem
{
    type:       BookRefType;
    title:      string;
    desc?:      string;
    resume?:    string;
    link?:      string;
    refs?:      BookRefItem[];
}