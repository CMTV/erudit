export enum LinkType
{
    Book =          'book',

    //
    // Topic
    //

    Article =       'article',
    Summary =       'summary',
    Practicum =     'practicum',
    TopicFile =     'site/files',

    //
    // HQ
    //

    Contributor =   'hq/contributor',
    Contributors =  'hq/contributors',
    Todo =          'hq/todo',
    Guide =         'hq/guide',

    //
    // Other
    //

    Sponsors =      'sponsors',
}


export function link(type: Uncapitalize<keyof typeof LinkType>, id: string = null, ...other: string[])
{
    let typePart = LinkType[type.charAt(0).toUpperCase() + type.slice(1)];

    if (!typePart)
        throw new Error(`Unknown router type '${type}' when making link: '${type}${id ? '.' + id : ''}'`);

    let link = '/';
        link += typePart;
    
    if (id)
        link += '/' + id;

    if (other.length !== 0)
        link += '/' + other.join('/');

    return link;
}