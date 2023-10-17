export function initAnchorDetector()
{
    if (window.location.hash)
        revealTarget(window.location.hash.slice(1));

    window.addEventListener('hashchange', () =>
    {
        let id = window.location.hash;
        revealTarget(id.slice(1));
    });
}

//

export function revealTarget(id: string)
{
    if (document.documentElement.getAttribute('data-layout') !== 'topic')
        return;

    let targetElem = document.getElementById(id);

    if (!targetElem)
        return;

    let parent = targetElem;
    while ((parent = parent.parentElement) !== null)
    {
        // Accent Block

        if (parent.classList.contains('accentBlock'))
        {
            let expand = parent.querySelector(':scope > .base > .expand');
            if (expand && expand.contains(targetElem))
                parent.setAttribute('data-expand-open', '');
        }

        // Task

        if (parent.classList.contains('task'))
        {
            let sections = parent.querySelectorAll(':scope > section');
            sections.forEach(section =>
            {
                if (section.contains(targetElem))
                    parent.setAttribute(`data-${section.getAttribute('data-name')}-open`, '');
            });
        }
    }

    let link = document.createElement('a');
        link.href = '#' + id;
        link.click();
}