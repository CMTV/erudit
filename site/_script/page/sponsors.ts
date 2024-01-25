import OMath from "global/OMath";

window.addEventListener('load', () =>
{
    let asideToggler = OMath.get().asideToggler;

    asideToggler.asides.minor.querySelector(':scope .mini > button.tierInfo').addEventListener('click', () =>
    {
        asideToggler.toggleAside(asideToggler.asides.minor, true);
    });
});