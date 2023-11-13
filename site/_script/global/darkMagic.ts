export function initDarkMagicCheck()
{
    function activateReplacers()
    {
        document.querySelectorAll('.noDarkMagicContainer').forEach(element => element.parentElement.removeAttribute('id'));
    }

    fetch('https://yandex.ru/ads/system/context.js').then(response => {
        if (!response.ok)
            activateReplacers();
    }).catch(() => activateReplacers());
}