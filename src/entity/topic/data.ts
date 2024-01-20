import { TopicCustomSEO } from "./global";

export default class DataTopicConfig
{
    title: string;
    desc: string;
    keywords: string[];
    contributors: string[];
    seo?: TopicCustomSEO;
}