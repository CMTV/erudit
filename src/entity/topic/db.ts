import { Block } from "blp";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class DbTopic
{
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    desc: string;

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
}