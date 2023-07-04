import { ViewBaseContributor } from "src/entity/contributor/view";

export async function getContributorList(contributorsObj)
{
    let contributors = Object.keys(contributorsObj).sort((a,b) => contributorsObj[b] - contributorsObj[a]);
    let viewContributors = [];

    for (let i = 0; i < contributors.length; i++)
        viewContributors.push(await ViewBaseContributor.fromId(contributors[i]));

    return viewContributors;
}