import { Column, Entity, PrimaryColumn } from "typeorm";

import { TocItem } from "src/entity/toc/global";

@Entity()
export default class DbTopicToc
{
    @PrimaryColumn()
    topicId: string;

    @PrimaryColumn()
    topicPart: string;

    @Column('simple-json')
    toc: TocItem[];
}