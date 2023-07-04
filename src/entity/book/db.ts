import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class DbBook
{
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    desc: string;

    @Column('simple-array', { nullable: true })
    results: string[];

    @Column('simple-array', { nullable: true })
    topics: string[];

    @Column({ default: false })
    hasDecoration: boolean;

    @Column()
    displayOrder: number;

    @Column({ nullable: true })
    shelfId: number;
}