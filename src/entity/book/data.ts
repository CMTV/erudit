import { BookWipItem } from "./global";

export default class DataBookInfo
{
    desc: string;
    results: string[];
    topics: string[];
}

export class DataBookWip
{
    todo: BookWipItem[];
}