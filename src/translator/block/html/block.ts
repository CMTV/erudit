import { Inliner } from "blp";
import { EruditBlock } from "../eruditBlock";

export default class Html extends EruditBlock
{
    _type = 'html';

    inliners: { [id: string]: Inliner[] }
    content: string;
}