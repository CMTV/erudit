window.addEventListener('load', () =>
{
    document.querySelectorAll('body > main > article .wipBook .progress').forEach(progressElem =>
    {
        progressElem.querySelector(':scope .explain > .done').addEventListener('click', () =>
        {
            progressElem.toggleAttribute('data-goals-open');
        });
    });
});