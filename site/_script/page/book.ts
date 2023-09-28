import OMath from "global/OMath";

window.addEventListener('load', () =>
{
    let asideToggler = OMath.get().asideToggler;

    asideToggler.asides.minor.querySelector(':scope > .mini > button.contribution').addEventListener('click', () =>
    {
        asideToggler.toggleAside(asideToggler.asides.minor, true);
    });

    document.querySelectorAll('body > main > article .progress').forEach(progressElem =>
    {
        progressElem.querySelector(':scope .explain > .done').addEventListener('click', () =>
        {
            progressElem.toggleAttribute('data-goals-open');
        });
    });
});