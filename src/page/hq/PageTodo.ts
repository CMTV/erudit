import { ViewTodoBook } from "src/entity/todo/view";
import SEO from "../component/SEO";
import PageHQ from "./PageHQ";

export default class PageTodo extends PageHQ
{
    layout = 'todo';
    hqPage = 'todo';

    hasStyle = true;
    hasScript = true;

    books: { [bookId: string]: ViewTodoBook};

    constructor()
    {
        super();

        this.seo = new SEO;
        this.seo.title = 'Список улучшений | OMath';
        this.seo.desc = 'Список нужных улучшений, которые можно реализовать и сделать учебники еще круче!';
    }

    getDest(): string
    {
        return `todo/index.html`;
    }
}