import OMath from "global/OMath";

window.addEventListener('load', () =>
{
    let asideToggler = OMath.get().asideToggler;

    asideToggler.asides.minor.querySelector(':scope .mini > button.contribution').addEventListener('click', () =>
    {
        asideToggler.toggleAside(asideToggler.asides.minor, true);
    });

    asideToggler.asides.minor.querySelectorAll(':scope .contributionList .book').forEach(bookElem =>
    {
        bookElem.addEventListener('click', () => bookElem.toggleAttribute('data-open'));
    });
});