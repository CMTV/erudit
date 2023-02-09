import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class DbTopicContributor
{
    @PrimaryColumn()
    topicId: string;

    @PrimaryColumn()
    contributorId: string;

    @Column()
    displayOrder: number;
}