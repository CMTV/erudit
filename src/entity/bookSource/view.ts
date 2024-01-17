import { erudit } from "src/erudit";
import DbBookSource from "./db";
import { BookSourceType } from "./global";
import DbTopicSourceRef from "../topicSourceRef/db";
import { countBy, orderBy } from "lodash";
import DbTopic from "../topic/db";
import { link } from "src/router";
import { prettify } from "src/util/str";

export class ViewSource
{
    id:         number;
    featured:   boolean;
    icon:       string;
    title:      string;
    desc:       string;
    link:       string;
    resume:     string;
}

export class ViewBookSource extends ViewSource
{
    total:      number;
    topics?:    ViewBookSourceTopic[];
}

export class ViewBookSourceTopic
{
    link:       string;
    title:      string;
    total:      number;
}

//

export async function getViewBookSources(bookId: string): Promise<ViewSource[]>
{
    const viewSources: ViewSource[] = [];

    const dbSources = await erudit.db.manager.findBy(DbBookSource, { bookId });
    for (const dbSource of dbSources)
        viewSources.push(makeViewSource(dbSource));

    return viewSources;
}

export function makeViewSource(dbSource: DbBookSource): ViewSource
{
    const viewSource = new ViewSource;

    viewSource.id =     dbSource.id;
    viewSource.featured = dbSource.featured;
    viewSource.icon =   getViewSourceIcon(dbSource.type as BookSourceType);
    viewSource.title =  prettify(dbSource.title);
    viewSource.desc =   prettify(dbSource.desc);
    viewSource.link =   dbSource.link;
    viewSource.resume = prettify(dbSource.resume);

    return viewSource;
}

//
//
//

export async function getSourcesForBook(bookId: string): Promise<ViewBookSource[]>
{
    const bookSources = await getViewBookSources(bookId);
    for (const bookSource of bookSources)
    {
        const topics = await getViewSourceTopics(bookSource.id);
        if (topics.length === 0)
            continue;

        let _bookSource = bookSource as ViewBookSource;
            _bookSource.topics = topics;
            _bookSource.total =  _bookSource.topics.reduce((accumulator, current) => accumulator + current.total, 0);
    }

    return orderBy(bookSources as ViewBookSource[], [bookSource => bookSource.featured, bookSource => bookSource.total || 0], ['desc', 'desc']);
}

async function getViewSourceTopics(sourceId: number): Promise<ViewBookSourceTopic[]>
{
    const viewSourceTopics: ViewBookSourceTopic[] = [];

    const topicIdCountMap = countBy(
        await erudit.db.manager.find(DbTopicSourceRef, { select: ['topicId'], where: { sourceId } }),
        dbTopicSource => dbTopicSource.topicId
    );
 
    for (const [topicId, count] of Object.entries(topicIdCountMap))
        viewSourceTopics.push(await makeViewSourceTopic(topicId, count));

    return viewSourceTopics;
}

async function makeViewSourceTopic(topicId: string, count: number)
{
    const viewSourceTopic = new ViewBookSourceTopic;

    const dbTopic = await erudit.db.manager.findOne(DbTopic, {
        select: ['title', 'parts'],
        where:  { id: topicId },
    });

    viewSourceTopic.total =     count;
    viewSourceTopic.title =     dbTopic.title;
    viewSourceTopic.link =      link(dbTopic.parts[0] as any, topicId, '#sources');

    return viewSourceTopic;
}

function getViewSourceIcon(sourceType: BookSourceType): string
{
    switch (sourceType)
    {
        case BookSourceType.Book: return 'i-book';
        case BookSourceType.Site: return 'i-globe';

        default: return 'i-arrow-rigth';
    }
}