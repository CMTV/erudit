import AsideToggler from "../AsideToggler";
import PaneSwitcher from "./PaneSwitcher";

export default class AsideMajor
{
    panesManager: PaneSwitcher;
    toggler: AsideToggler;

    constructor(toggler: AsideToggler)
    {
        this.toggler = toggler;
        this.panesManager = new PaneSwitcher(this.toggler);
    }
}