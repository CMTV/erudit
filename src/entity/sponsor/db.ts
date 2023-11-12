import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class DbSponsor
{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    tier: number;

    @Column()
    retired: boolean;

    @Column('simple-json')
    data: object;
}