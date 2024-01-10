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

    //
    
    for (const bookSourceElem of document.querySelectorAll('.bookSources > .source'))
    {
        bookSourceElem.querySelector(':scope > .info > .title > .total')?.addEventListener('click', () =>
        {
            bookSourceElem.classList.toggle('usageShowing');
        });
    }

    document.querySelector('.bookSources .hideOverlay > button')?.addEventListener('click', () =>
    {
        document.querySelector('.bookSources')?.classList.remove('hidden');
    });
});