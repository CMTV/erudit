export type TDataTopicSourceRefs = {
    [sourceId: string]: TDataTopicSourceRef[]
};

export type TDataTopicSourceRef = {
    title:  string;
    link?:  string;
    desc?:  string;
}