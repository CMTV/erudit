import { DataSource } from "typeorm";

// Db Entities
import DbContributor from "src/entity/contributor/db";
import DbShelf from "src/entity/shelf/db";
import DbBook from "src/entity/book/db";
import DbBookToc from "src/entity/bookToc/db";
import DbTopic from "src/entity/topic/db";
import DbTopicToc from "src/entity/topicToc/db";
import DbUnique from "src/entity/unique/db";
import DbRef from "src/entity/ref/db";
import DbFile from "src/entity/file/db";
import DbTopicContributor from "src/entity/topicContributor/db";
import DbBookStats from "src/entity/bookStats/db";
import DbTodo from "src/entity/todo/db";
import DbSponsor from "src/entity/sponsor/db";
import DbBookSource from "src/entity/bookSource/db";
import DbTopicSourceRef from "src/entity/topicSourceRef/db";

export default function getDb(pathToDb: string)
{
    return new DataSource({
        type: 'better-sqlite3',
        database: pathToDb,
        synchronize: true,
        entities: [
            DbContributor,
            DbSponsor,

            DbShelf,
            DbBook,
            DbBookToc,
            DbBookStats,
            DbBookSource,

            DbTopic,
            DbTopicToc,
            DbTopicContributor,
            DbTopicSourceRef,
            DbTodo,

            DbUnique,
            DbRef,

            DbFile
        ]
    }).initialize();
}