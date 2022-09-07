import { InlinerRegexpFactory } from "blp";

import Link from "./inliner";

export default class FLink extends InlinerRegexpFactory<Link>
{
    protected regexp = /\[(.+?)\]\((.+?)\)/gm;

    protected parseMatch(match: RegExpExecArray): Link
    {
        let link = new Link;
            link.label = this.parser.parseInliners(match[1]);
            link.target = match[2];
    
        return link;
    }
}