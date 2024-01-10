import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class DbBookSource
{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ default: false })
    featured: boolean;

    @Column()
    sourceId: string;

    @Column()
    bookId: string;

    @Column()
    type: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    desc: string;

    @Column({ nullable: true })
    link: string;

    @Column({ nullable: true })
    resume: string;
}