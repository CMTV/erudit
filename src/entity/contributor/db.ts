import { Block } from "blp";

import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class DbContributor
{
    @PrimaryColumn()
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    displayName: string;

    @Column({ nullable: true })
    slogan: string;

    @Column('simple-json', { nullable: true })
    links: object;

    @Column({ nullable: true })
    avatarExt: string;

    @Column('simple-json', { nullable: true })
    about: Block[];
}