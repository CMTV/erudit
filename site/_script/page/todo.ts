window.addEventListener('load', () =>
{
    document.querySelectorAll('body > main > article .book').forEach(book =>
    {
        book.querySelector(':scope > header .showSwitch').addEventListener('click', () => book.toggleAttribute('data-open'));

        book.querySelectorAll(':scope .topic').forEach(topic =>
        {
            topic.querySelector(':scope .action').addEventListener('click', () => topic.toggleAttribute('data-open'));
        });
    });
});