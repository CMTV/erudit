import { groupBy, orderBy } from "lodash";

import { ViewSource, makeViewSource } from "../bookSource/view";
import { erudit } from "src/erudit";
import DbTopicSourceRef from "./db";
import DbBookSource from "../bookSource/db";
import { prettify } from "src/util/str";

export class ViewTopicSource extends ViewSource
{
    refs: ViewTopicSourceRef[];
}

export class ViewTopicSourceRef
{
    title:  string;
    link?:  string;
    desc?:  string;
}

//

export async function getSourcesForTopic(topicId: string): Promise<ViewTopicSource[]>
{
    const resultArr: ViewTopicSource[] = [];

    const sourceIdRefMap = groupBy(
        await erudit.db.manager.findBy(DbTopicSourceRef, { topicId }),
        ref => ref.sourceId
    );

    const sourceIds = Object.keys(sourceIdRefMap);
    for (const sourceId of sourceIds)
    {
        const viewBookSource = makeViewSource(await erudit.db.manager.findOneBy(DbBookSource, { id: +sourceId })) as ViewTopicSource;
        
        viewBookSource.refs = sourceIdRefMap[sourceId].map(dbRef => {
            const viewRef = new ViewTopicSourceRef;
            
            viewRef.title = prettify(dbRef.title);
            viewRef.link =  dbRef.link;
            viewRef.desc =  prettify(dbRef.desc);

            return viewRef;
        });

        resultArr.push(viewBookSource);
    }

    return orderBy(resultArr,  [bookSource => bookSource.featured, bookSource => bookSource.refs.length || 0], ['desc', 'desc']);
}