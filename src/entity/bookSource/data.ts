import { BookSourceType } from "./global"

export type TDataBookSources = {
    [sourceId: string]: TDataBookSource
}

export type TDataBookSource =
{
    type:       BookSourceType;
    featured:   boolean;
    title:      string;
    desc?:      string;
    link?:      string;
    resume?:    string;
}