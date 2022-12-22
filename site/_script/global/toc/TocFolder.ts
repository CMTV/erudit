window.addEventListener('load', () =>
{
    document.querySelector('.bookToc .tocFolder > .tocItem > a').addEventListener('click', function()
    {
        let folder = this.closest('.tocFolder') as HTMLElement;
        folder.toggleAttribute('data-open');
    });
});