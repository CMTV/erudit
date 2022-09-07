import { Block, Inliner } from "blp";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class DbUnique
{    
    @PrimaryColumn()
    id: string;

    @Column('simple-json', { nullable: true })
    content: Block[] | Inliner[];
}