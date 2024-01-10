import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class DbTopicSourceRef
{
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column()
    sourceId: number;

    @Column()
    topicId: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    link: string;

    @Column({ nullable: true })
    desc: string;
}