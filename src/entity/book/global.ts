import { link } from "src/router";

export class BookWipItem
{
    goal: string;
    done: boolean;
}

export function getBookDecorationLink(bookId: string)
{
    return link('book', bookId, 'decoration.svg');
}