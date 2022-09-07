import { Inliner, Text } from "blp";

export default class Renderer
{
    static plainStr(inliners: Inliner[])
    {
        let str = '';

        inliners.forEach(inliner =>
        {
            switch (inliner._type)
            {
                case 'text':
                    str += (inliner as Text).content;
                    break;
            }
        });

        return str;
    }
}