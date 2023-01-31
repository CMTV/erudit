import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class DbFile
{
    @PrimaryColumn()
    src: string;
}