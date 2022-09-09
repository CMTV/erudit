export default class SinglePage
{
    name:   string;
    label:  string;
    link:   string;
    icon:   string;
    active: boolean;

    constructor(rawPage: SinglePage)
    {
        this.icon = rawPage.icon ?? predefinedIcons[this.name] ?? 'file-lines';
    }
}

let predefinedIcons = 
{
    src: 'code',
    community: 'comments',
    donate: 'donate'
}