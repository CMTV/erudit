export class GlobalTocBookView
{
    id: string;
    title: string;
}

export class GlobalTocShelfView
{
    title: string;
    books: GlobalTocBookView[];
} 

export type GlobalTocView = GlobalTocShelfView[]; 