import { Inliner } from "blp";

export default class Link extends Inliner
{
    _type = 'link';

    label: Inliner[];
    target: string;
}