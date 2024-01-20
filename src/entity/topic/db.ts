import { Block } from "bitran";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { TopicCustomSEO } from "./global";

@Entity()
export default class DbTopic
{
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    desc: string;

    @Column('simple-array', { nullable: true })
    keywords: string[];

    @Column({ nullable: true })
    previousId: string;

    @Column({ nullable: true })
    nextId: string;

    @Column()
    bookId: string;

    @Column('simple-array')
    parts: string[];

    @Column('simple-json', { nullable: true })
    article: Block[];

    @Column('simple-json', { nullable: true })
    summary: Block[];

    @Column('simple-json', { nullable: true })
    practicum: Block[];

    @Column('simple-json', { nullable: true })
    seo: TopicCustomSEO;
}