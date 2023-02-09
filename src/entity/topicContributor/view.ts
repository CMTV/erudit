import { erudit } from "src/erudit";
import DbContributor from "../contributor/db";

export class ViewTopicContributor
{
    avatar: string;
    name:   string;
    link:   string;

    static async fromId(contributorId: string)
    {
        let dbContributor = await erudit.db.manager.findOne(DbContributor, { where: { id: contributorId } });

        let view = new ViewTopicContributor;
            view.name = dbContributor.displayName ?? dbContributor.name ?? dbContributor.id;
            
        if (dbContributor.avatarExt)
            view.avatar = `/site/graphics/contributors/${dbContributor.id}.${dbContributor.avatarExt}`;
        else
            view.avatar = '/site/graphics/defaultAvatar.png';

        view.link = `/@contributor/${dbContributor.id}`;

        return view;
    }
}