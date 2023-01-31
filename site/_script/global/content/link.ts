import OMath from "global/OMath";

export function initPreviewLinksIn(element: Element)
{
    element.querySelectorAll('a[data-preview]').forEach(link =>
    {
        let timeout;
        let canOpenLink = false;

        link.addEventListener('click', (e) =>
        {
            if (canOpenLink)
                return;

            e.preventDefault();

            clearTimeout(timeout);
            canOpenLink = true;
            timeout = setTimeout(() => { canOpenLink = false; }, 300);

            // Preview

            OMath.get().preview.loadView(link.getAttribute('data-preview'), link.getAttribute('href'));
        });
    });
}