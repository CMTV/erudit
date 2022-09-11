export class GlobalTocBookView
{
    id: string;
    title: string;
}

export default class GlobalTocView
{
    [shelfName: string]: GlobalTocBookView[];
}