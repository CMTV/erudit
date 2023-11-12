import OMath from "global/OMath";
import { initAnchorDetector } from "global/anchor";
import { LiveTocPos } from "include/liveTocPos";
import { SPONSOR_DATA, SponsorBlockController, loadTopicSponsorData } from "include/sponsorBlock";

window.addEventListener('DOMContentLoaded', () =>
{
    setupTopicSponsors();
});

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

    new LiveTocPos(asideToggler.asides.minor.querySelector(':scope > .full .topicToc .tocTree'));
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

function setupTopicSponsors()
{
    let tier3Elem = document.getElementById('sponsorBlockTier3');
    let tier2Elem = document.getElementById('sponsorBlockTier2');

    loadTopicSponsorData().then(result =>
    {
        if (!result)
        {
            [tier3Elem, tier2Elem].forEach(elem => elem.remove());
            return;
        }

        new SponsorBlockController(tier3Elem, 3);
        new SponsorBlockController(tier2Elem, 2);
    });
}

export function toggleTodoView()
{
    document.documentElement.classList.toggle('displayTodo');
    let minorView = OMath.get().asideToggler.asides.minor.querySelector(':scope > .full > .minorView.todo');
    minorView.toggleAttribute('data-visible');
}