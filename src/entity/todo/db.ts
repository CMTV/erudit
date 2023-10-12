import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class DbTodo
{
    @PrimaryColumn()
    id: string;

    @Column()
    bookId: string;

    @Column()
    topicId: string;

    @Column()
    part: string;

    @Column()
    title: string;
}