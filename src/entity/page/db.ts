import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class DbPage
{
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    displayOrder: number;
}