import { globSync } from "glob";

import DbSponsor from "src/entity/sponsor/db";
import EruditProcess from "../EruditProcess";
import { exists, normalize, toForwardSlash } from "src/util/io";
import { parseYamlFile } from "src/util";
import DataSponsorList, { DataSponsor } from "src/entity/sponsor/data";
import { Sponsor, SponsorTheme } from "src/entity/sponsor/global";

export default class FillSponsors extends EruditProcess
{
    name = 'Fill sponsors';

    async do()
    {
        let sponsorList = this.getSponsorList();

        if (!sponsorList)
            return;

        let dbSponsors: DbSponsor[] = [];

        Object.keys(sponsorList).forEach(sponsorId => dbSponsors.push(this.makeDbSponsor(sponsorId, sponsorList[sponsorId])));

        await this.db
                    .createQueryBuilder()
                    .insert()
                    .into(DbSponsor)
                    .values(dbSponsors)
                    .execute();
    }

    getSponsorList()
    {
        let sponsorListPath = normalize(this.erudit.path.project('sponsors', 'list.yml'));

        if (!exists(sponsorListPath))
            return null;
        
        let sponsorListData = (parseYamlFile(sponsorListPath) as DataSponsorList);

        if (!sponsorListData || Object.keys(sponsorListData).length === 0)
            return null;

        return sponsorListData;
    }

    makeDbSponsor(sponsorId: string, sponsor: DataSponsor)
    {
        this.validateSponsor(sponsorId, sponsor);

        let dbSponsor = new DbSponsor;
            dbSponsor.retired = !!sponsor.retired;
            dbSponsor.tier =    sponsor.tier;

        sponsor.id = sponsorId;

        if (!sponsor.name)
            sponsor.name = sponsorId;

        if (sponsor.tier === 3)
        {
            if (!sponsor.theme)
                sponsor.theme = SponsorTheme.setupTheme(sponsor.color ?? SponsorTheme.getNextDefaultColor());

            sponsor.avatarVideo = this.getSponsorVideo(sponsorId);
        }

        if (sponsor.tier >= 2)
        {
            if (!sponsor.messages)
            {
                sponsor.messages = [...DEFAULT_MESSAGES];
                if (sponsor.slogan)
                    sponsor.messages.push(sponsor.slogan);
            }

            sponsor.avatar = this.getSponsorAvatar(sponsorId);
        }

        dbSponsor.data = sponsor;

        return dbSponsor;
    }

    getSponsorAvatar(sponsorId: string)
    {
        let photos = globSync(toForwardSlash(this.erudit.path.project('sponsors', 'avatars', `${sponsorId}.{png,jpg,jpeg,webp}`)));

        if (photos.length === 0)
            return undefined;

        return toForwardSlash(photos[0]).split('/').pop();
    }

    getSponsorVideo(sponsorId: string)
    {
        let filename = sponsorId + '.mp4';
        let path = this.erudit.path.project('sponsors', 'avatars', filename);

        if (!exists(path))
            return undefined;
        
        return filename;
    }

    validateSponsor(sponsorId: string, sponsor: Sponsor)
    {
        /* Do some checks */
    }
}

const DEFAULT_MESSAGES = [
    'Я поддерживаю «Открытую математику»!',
];