import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class DbRef
{
    @PrimaryColumn()
    target: string;

    @PrimaryColumn()
    from: string;

    @Column({ default: false })
    hasPreview: boolean;

    @Column({ default: false })
    broken: boolean;
}