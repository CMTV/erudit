import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class DbShelf
{
    @PrimaryColumn()
    id: number;

    @Column()
    title: string;
}