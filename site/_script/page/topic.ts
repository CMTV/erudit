import { computePosition, shift, autoUpdate, arrow } from "@floating-ui/dom"

import OMath from "global/OMath";
import { initAnchorDetector } from "global/anchor";
import { getAnimSpeed } from "global/computed";
import { LiveTocPos } from "include/liveTocPos";
import { SponsorBlockController, loadTopicSponsorData } from "include/sponsorBlock";

window.addEventListener('DOMContentLoaded', () =>
{
    setupTopicSponsors();
});

window.addEventListener('load', () =>
{
    let asideToggler = OMath.get().asideToggler;

    asideToggler.asides.minor.querySelector(':scope .mini > a[data-current]').addEventListener('click', () =>
    {
        asideToggler.toggleAside(asideToggler.asides.minor, true);
    });

    setupContributorsView();
    setupTodoView();

    if (window.location.hash.startsWith('#todo:'))
        toggleTodoView();

    initAnchorDetector();

    new LiveTocPos(asideToggler.asides.minor.querySelector(':scope .full .topicToc .tocTree'));

    flagTooltips();
});

function setupContributorsView()
{
    let minorElem = OMath.get().asideToggler.asides.minor;

    let contributorsOpenElem = minorElem.querySelector(':scope .full > .contributors');
    let view = minorElem.querySelector(':scope .full > .minorView.contribution');
    let closeElem = view.querySelector(':scope .close');

    [contributorsOpenElem, closeElem].forEach(element =>
    {
        element.addEventListener('click', () => view.toggleAttribute('data-visible'));
    });
}

function setupTodoView()
{
    let minorElem = OMath.get().asideToggler.asides.minor;

    let todoSwitch = minorElem.querySelector(':scope .full > .editorSwitch');
    let minorView = minorElem.querySelector(':scope .full > .minorView.todo');

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
    let minorView = OMath.get().asideToggler.asides.minor.querySelector(':scope .full > .minorView.todo');
    minorView.toggleAttribute('data-visible');
}

//
//
//

function flagTooltips()
{
    const main = document.querySelector('#__erudit > main');

    main.querySelectorAll(':scope > article > header > .flags > .flag').forEach((flag: HTMLElement) => {
        const tooltip = flag.querySelector('.tooltip') as HTMLElement;
        const arrowElem = tooltip.querySelector('.arrow') as HTMLElement;

        let autoUpdateState = (() => {
            let state = null;

            function clearState() {
                try { state(); state = null; } catch {}
            }

            function startUpdating() {
                if (state)
                    return;

                clearState();
                state = autoUpdate(flag, tooltip, compute);
            }

            return { clearState, startUpdating }
        })();

        compute();

        [
            ['mouseenter', show],
            ['mouseleave', hide],
        ].forEach(([event, listener]) => {
            flag.addEventListener(event, listener);
        })

        function show()
        {
            clearTimeout(styleResetTimeout);
            autoUpdateState.startUpdating();
            tooltip.classList.toggle('showing', true);
        }

        let styleResetTimeout = null;

        function hide()
        {
            autoUpdateState.clearState();
            tooltip.classList.toggle('showing', false);

            styleResetTimeout = setTimeout(() => {
                tooltip.removeAttribute('style');
                arrowElem.removeAttribute('style');
            }, getAnimSpeed());
        }

        function compute()
        {
            computePosition(flag, tooltip, {
                placement: 'bottom',
                middleware: [
                    shift({boundary: document.querySelector('main'), padding: 10}),
                    arrow({element: arrowElem}),
                ],
            }).then(({x, y, middlewareData}) => {
                Object.assign(tooltip.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                });

                Object.assign(arrowElem.style, {
                    left: x != null ? `${middlewareData.arrow.x}px` : '',
                    top: y != null ? `${middlewareData.arrow.y}px` : '',
                });
            });
        }
    });
}