export default class OtherLink
{
    name:   string;
    label:  string;
    link:   string;
    icon:   string;

    constructor(name: string, rawLink: OtherLink)
    {
        this.name =     name;
        this.label =    rawLink.label;
        this.link =     rawLink.link;
        this.icon =     rawLink.icon ?? predefinedIcons[this.name] ?? 'link';
    }

    static fromRaw(rawLinks: object)
    {
        if (!rawLinks)
            return [];

        return Object.keys(rawLinks).map(name => new OtherLink(name, rawLinks[name]));
    }
}

let predefinedIcons = 
{
    src: 'code',
    community: 'comments',
    donate: 'donate'
}