import OMath from "global/OMath";

window.addEventListener('load', () =>
{
    let asideToggler = OMath.get().asideToggler;

    asideToggler.asides.minor.querySelector(':scope > .mini > a[data-current]').addEventListener('click', () =>
    {
        asideToggler.toggleAside(asideToggler.asides.minor, true);
    });

    asideToggler.asides.minor.querySelector(':scope > .full > .contributors').addEventListener('click', () =>
    {
        asideToggler.asides.minor.querySelector(':scope > .full').toggleAttribute('data-contributors-view');
    });
});