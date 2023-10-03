import OMath from "global/OMath";

window.addEventListener('load', () =>
{
    let asideToggler = OMath.get().asideToggler;

    asideToggler.asides.minor.querySelector(':scope > .mini > a[data-current]').addEventListener('click', () =>
    {
        asideToggler.toggleAside(asideToggler.asides.minor, true);
    });

    setupContributorsView();
});

function setupContributorsView()
{
    let minorElem = OMath.get().asideToggler.asides.minor;

    let contributorsOpenElem = minorElem.querySelector(':scope > .full > .contributors');
    let view = minorElem.querySelector(':scope > .full > .minorView.contribution');
    let closeElem = view.querySelector(':scope .close');

    [contributorsOpenElem, closeElem].forEach(element =>
    {
        element.addEventListener('click', () => view.toggleAttribute('data-visible'));
    });
}