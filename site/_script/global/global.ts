import AsideToggler from "./aside/AsideToggler";
import AsideMajor from "./aside/major/AsideMajor";
import MajorToc from "./toc/MajorToc";

import Preview from "./preview/Preview";
import OMath from "./OMath";
import { getContentOptions } from "./content";
import { initDarkMagicCheck } from "./darkMagic";

window['OMath'] = new OMath;

declare let OMathContent;

window.addEventListener('DOMContentLoaded', () =>
{
    OMath.get().preview = new Preview;
    OMath.get().asideToggler = new AsideToggler;

    new AsideMajor(OMath.get().asideToggler);
    new MajorToc(OMath.get().asideToggler);

    globalThis.OMathContentOptions = getContentOptions();


    globalThis.MermaidPromise = import('mermaid');

    OMathContent.initProducts(
        document.querySelector('#__erudit > main > article > [data-content]'),
        globalThis.OMathContentOptions
    );

    initDarkMagicCheck();
});

globalThis.OMathEvent = globalThis.OMathEvent || {};

globalThis.OMathEvent.onLinkClick = (link, e) =>
{
    let url = link.getAttribute('data-preview').replace(/[\|:]/gm, '/');
        url = '/site/uniques/' + url + '.html';

    OMath.get().preview.loadView(url, link.getAttribute('href'));
}