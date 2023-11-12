import { erudit } from "src/erudit";
import DbContributor from "./db";
import RepoContributor from "./repository";
import { link } from "src/router";

export class ViewBaseContributor
{
    avatar: string;
    name:   string;
    link:   string;

    static async fromId(contributorId: string)
    {
        let dbContributor = await erudit.db.manager.findOne(DbContributor, { where: { id: contributorId } });

        let view = new ViewBaseContributor;
            view.name =     dbContributor.displayName ?? dbContributor.name ?? dbContributor.id;
            view.avatar =   getAvatarSrc(dbContributor);
            view.link =     getContributorLink(contributorId);

        return view;
    }
}

export class ViewContributor
{
    avatar:     string;
    name:       string;
    slogan:     string;
    link:       string;
    editor:     boolean;

    topics: number;
    books: number;

    static async fromId(contributorId: string): Promise<ViewContributor>
    {
        let dbContributor = await erudit.db.manager.findOne(DbContributor, { where: { id: contributorId } });

        let view = new ViewContributor;
            view.name =     dbContributor.displayName ?? dbContributor.name ?? dbContributor.id;
            view.slogan =   dbContributor.slogan;
            view.avatar =   getAvatarSrc(dbContributor);
            view.link =     getContributorLink(contributorId);
            view.editor =   dbContributor.editor;

        let contributionData = await (new RepoContributor(erudit.db)).getContributionData(contributorId);

        view.books = Object.keys(contributionData).length;

        view.topics = 0;
        Object.values(contributionData).forEach(topicIds => view.topics += topicIds.length);

        return view;
    }
}

//
//
//

function getContributorLink(contirbutorId: string)
{
    return link('contributor', contirbutorId);
}

function getAvatarSrc(dbContributor: DbContributor)
{
    return '/site/graphics/' + (dbContributor.avatarExt ? `contributors/${dbContributor.id}.${dbContributor.avatarExt}` : 'defaultAvatar.svg');
}