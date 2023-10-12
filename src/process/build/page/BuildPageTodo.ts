import RepoTodo from "src/entity/todo/repository";
import { ViewTodoBook, ViewTodoItem, ViewTodoTopic } from "src/entity/todo/view";
import PageTodo from "src/page/hq/PageTodo";
import EruditProcess from "src/process/EruditProcess";

export default class BuildPageTodo extends EruditProcess
{
    name = 'Build todo page';

    async do()
    {
        let page = new PageTodo;
        await this.setupTodoData(page);
     
        page.compile();
    }


    async setupTodoData(page: PageTodo)
    {
        let repo = new RepoTodo(this.db);
        let dbTodos = await repo.getTodos();

        if (dbTodos.length === 0)
            return;

        page.books = {};

        for (let i = 0; i < dbTodos.length; i++)
        {
            let dbTodo = dbTodos[i];

            page.books[dbTodo.bookId] = page.books[dbTodo.bookId] ?? await ViewTodoBook.fromId(dbTodo.bookId);

            let bookView = page.books[dbTodo.bookId];
                bookView.todosNum++;

            bookView.topics[dbTodo.topicId] = bookView.topics[dbTodo.topicId] ?? await ViewTodoTopic.fromId(dbTodo.topicId);
            bookView.topics[dbTodo.topicId].todos[dbTodo.id] = ViewTodoItem.fromDbTodo(dbTodo);
        }
    }
}