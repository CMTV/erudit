import { Block } from "blp";

export default class RefAlias extends Block
{
    _type = 'refAlias';

    aliasMap: { [alias: string]: string } = {};
}