export interface IDataContributorInfo
{
    name:           string;
    displayName:    string;
    slogan:         string;
    editor:         boolean;
    links:          { [label: string]: string }
}

export function getAvatarExt(files: string[])
{
    let avatars = files.filter(file => /^avatar\.(\w+)$/gm.test(file));

    if (avatars.length === 0)
        return null;

    return avatars.shift().split('.').pop();
}