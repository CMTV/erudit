import { TopicCustomSEO } from "./global";

export default class DataTopicConfig
{
    title: string;
    desc: string;
    keywords: string[];
    contributors: string[];
    seo?: TopicCustomSEO;
    advanced?: boolean;
    wip?: boolean;
    dependencies?: string[];
}