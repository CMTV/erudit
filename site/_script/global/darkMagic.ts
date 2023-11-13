export function initDarkMagicCheck()
{
    let checkDelay = 10000;
    let darkMagicElements = document.querySelectorAll('.darkMagic');

    darkMagicElements.forEach(element =>
    {
        function check()
        {
            observer.disconnect();

            let replacer = element.querySelector('.noDarkMagicContainer');
            if (replacer)
                replacer.parentElement.removeAttribute('id');
        }

        let checkTimeout;

        let observer = new MutationObserver(() => {
            clearTimeout(checkTimeout);
            checkTimeout = setTimeout(() => check(), checkDelay);
        });

        observer.observe(element, { childList: true, subtree: true });

        checkTimeout = setTimeout(() => check(), checkDelay);
    });
}