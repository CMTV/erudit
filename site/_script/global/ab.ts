export function initAccentBlocksIn(element: HTMLElement)
{
    element.querySelectorAll('.accentBlock').forEach(abElem =>
    {
        let expandButton = abElem.querySelector(':scope > .side > .expand');
        if (expandButton)
            expandButton.addEventListener('click', () => abElem.toggleAttribute('data-expand-open'));
    });
}