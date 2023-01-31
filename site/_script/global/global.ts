import AsideToggler from "./aside/AsideToggler";
import AsideMajor from "./aside/major/AsideMajor";
import MajorToc from "./toc/MajorToc";

import Preview from "./preview/Preview";
import OMath from "./OMath";
import { initContentLogicIn } from "./content/logic";

window['OMath'] = new OMath;

window.addEventListener('load', () =>
{
    OMath.get().preview = new Preview;
    OMath.get().asideToggler = new AsideToggler;

    new AsideMajor(OMath.get().asideToggler);
    new MajorToc(OMath.get().asideToggler);

    initContentLogicIn(document.querySelector('body > main > article'));
});