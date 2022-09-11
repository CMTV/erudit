import { TocItem } from "src/entity/toc/global";

export enum BookTocItemType
{
    Chapter = 'chapter',
    Section = 'section',   
}

export class BookTocItem extends TocItem
{
    children: BookTocItem[];
}

export class TopicBookTocItem extends BookTocItem
{
    type = 'topic';
    parts: string[];
    isOptional: boolean;
}

export class SectionBookTocItem extends BookTocItem
{
    type = 'section';
    isChapter: boolean;
}