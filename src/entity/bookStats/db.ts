import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class DbBookStats
{
    @PrimaryColumn()
    bookId: string;

    @Column({ default: 0 })
    definitions: number;

    @Column({ default: 0 })
    theorems: number;

    @Column({ default: 0 })
    tasks: number;
}