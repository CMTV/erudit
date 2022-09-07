import AsideToggler from "./aside/AsideToggler";
import Preview from "./preview/Preview";

(<any>window).OMath = {};

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

    (<any>window).OMath.Preview = new Preview;

    new AsideToggler();
});
