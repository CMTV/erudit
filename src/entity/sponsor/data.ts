import { Sponsor } from "./global";

export class DataSponsor extends Sponsor
{
    color?: string;
}

export default class DataSponsorList
{
    [id: string]: DataSponsor;
}