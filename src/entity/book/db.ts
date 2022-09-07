import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class DbBook
{
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    displayOrder: number;

    @Column({ nullable: true })
    shelfId: number;
}