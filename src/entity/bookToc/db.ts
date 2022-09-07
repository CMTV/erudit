import { Column, Entity, PrimaryColumn } from "typeorm";

import { BookTocItem } from "./global";

@Entity()
export default class DbBookToc
{
    @PrimaryColumn()
    bookId: string;

    @Column('simple-json')
    toc: BookTocItem[];
}