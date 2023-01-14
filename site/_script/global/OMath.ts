import AsideToggler from "./aside/AsideToggler";
import Preview from "./preview/Preview";

export default class OMath
{
    preview: Preview;
    asideToggler: AsideToggler;

    static get(): OMath
    {
        return window['OMath'];
    }
}