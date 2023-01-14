import AsideToggler from "./aside/AsideToggler";
import AsideMajor from "./aside/major/AsideMajor";
import MajorToc from "./toc/MajorToc";

import Preview from "./preview/Preview";
import OMath from "./OMath";
import { initAccentBlocksIn } from "./ab";

window['OMath'] = new OMath;

window.addEventListener('load', () =>
{
    //
    // TODO:
    // Сделать так, чтобы открытое Preview можно было закрыть кликом по тому же элементу, если новых окон открыто не было!!!
    //
    // Base Usage: OMath.Preview.loadView('view2.json')
    //
    // view.json { "source": "goto destination url", "content": "<p>HTML Content Here!</p>" }
    //
    // br
    // button(onclick="OMath.Preview.loadView('view1.json')") Добавить view1
    // br
    // button(onclick="OMath.Preview.loadView('view2.json')") Добавить view2
    // br
    // button(onclick="OMath.Preview.loadView('view3.json')") Добавить view3
    // br
    // button(onclick="OMath.Preview.exit()") Выход

    OMath.get().preview = new Preview;
    OMath.get().asideToggler = new AsideToggler;

    new AsideMajor(OMath.get().asideToggler);
    new MajorToc(OMath.get().asideToggler);

    initAccentBlocksIn(document.querySelector('body > main > article'));
});