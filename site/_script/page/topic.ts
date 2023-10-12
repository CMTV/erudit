import OMath from "global/OMath";
import { initAnchorDetector } from "global/anchor";

window.addEventListener('load', () =>
{
    let asideToggler = OMath.get().asideToggler;

    asideToggler.asides.minor.querySelector(':scope > .mini > a[data-current]').addEventListener('click', () =>
    {
        asideToggler.toggleAside(asideToggler.asides.minor, true);
    });

    setupContributorsView();
    setupTodoView();

    if (window.location.hash.startsWith('#todo:'))
        toggleTodoView();

    initAnchorDetector();
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

function setupTodoView()
{
    let minorElem = OMath.get().asideToggler.asides.minor;

    let todoSwitch = minorElem.querySelector(':scope > .full > .editorSwitch');
    let minorView = minorElem.querySelector(':scope > .full > .minorView.todo');

    if (!minorView)
        return;
    
    let closeElem = minorView.querySelector(':scope .close');

    [todoSwitch, closeElem].forEach(element =>
    {
        element.addEventListener('click', () => toggleTodoView())
    });
}

export function toggleTodoView()
{
    document.documentElement.classList.toggle('displayTodo');
    let minorView = OMath.get().asideToggler.asides.minor.querySelector(':scope > .full > .minorView.todo');
    minorView.toggleAttribute('data-visible');
}