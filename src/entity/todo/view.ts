import { erudit } from "src/erudit";
import DbTodo from "./db";
import DbTopic from "../topic/db";
import DbBook from "../book/db";

export class ViewTodoItem
{
    id:     string;
    title:  string;
    href:   string;

    static fromDbTodo(dbTodo: DbTodo)
    {
        let view = new ViewTodoItem;
            view.id =       dbTodo.id;
            view.title =    dbTodo.title;
            view.href =     '/' + dbTodo.topicId + '/@' + dbTodo.part + '#' + dbTodo.id;

        return view;
    }
}

export class ViewTodoTopic
{
    id:     string;
    title:  string;
    todos:  { [todoId: string]: ViewTodoItem };

    static async fromId(topicId: string)
    {
        let topicTitle = (await erudit.db.manager.findOne(DbTopic, {
            select: { title: true },
            where: { id: topicId }
        })).title;

        let view = new ViewTodoTopic;
            view.id = topicId;
            view.title = topicTitle;
            view.todos = {};
        
        return view;
    }
}

export class ViewTodoBook
{
    id:             string;
    title:          string;
    decoration:     string;
    link:           string;
    todosNum:       number;
    topics:         { [topicId: string]: ViewTodoTopic};

    static async fromId(bookId: string)
    {
        let dbBook = await erudit.db.manager.findOne(DbBook, { where: { id: bookId } });

        let view = new ViewTodoBook;
            view.id = bookId;
            view.title = dbBook.title;
            view.decoration = dbBook.hasDecoration ? `/${bookId}/@book/decoration.svg` : null;
            view.link = `/${bookId}/@book/`;
            view.topics = {};
            view.todosNum = 0;

        return view;
    }
}