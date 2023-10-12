import { IsNull, Not } from "typeorm";

import Repository from "src/db/Repository";
import DbTodo from "./db";

export default class RepoTodo extends Repository
{
    async getTodos()
    {
        return this.db.manager.find(DbTodo);
    }

    async getTopicTodos(topicId: string, topicPart: string = null)
    {
        return this.db.manager.find(DbTodo, {
            where: {
                topicId: topicId,
                part: topicPart ?? Not(IsNull())
            }
        });
    }
}