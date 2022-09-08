OMath.setTheme = (theme) =>
{
    let actualTheme = theme;

    if (actualTheme === 'auto')
    {
        let preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
        let preferTheme = preferDark ? 'dark' : 'light';

        actualTheme = preferTheme;
    }

    document.documentElement.dataset.theme = theme === 'auto' ? theme + '-' + actualTheme : actualTheme;
    document.querySelector('meta[name="color-scheme"]').setAttribute('content', actualTheme);
    localStorage.setItem('theme', theme);
}

OMath.cycleTheme = () =>
{
    let themes = ['auto', 'light', 'dark'];
    let theme = localStorage.getItem('theme');

    let currentIndex = themes.indexOf(theme);
    if (currentIndex === -1)
        currentIndex++;

    if (currentIndex < themes.length - 1)
        currentIndex++;
    else
        currentIndex = 0;

    OMath.setTheme(themes[currentIndex]);
}

(() =>
{
    let OMath = window.OMath;

    let tag = document.createElement('meta');
        tag.setAttribute('name', 'color-scheme');
        tag.setAttribute('content', '');
    
    document.head.appendChild(tag);

    let updateTheme = () =>
    {
        let theme = localStorage.getItem('theme');

        if (theme === null || theme === 'null')
            theme = 'auto';
    
        OMath.setTheme(theme);
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => updateTheme());
    updateTheme();
})();