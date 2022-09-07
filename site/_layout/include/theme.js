OMath.setTheme = (theme) =>
{
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="color-scheme"]').setAttribute('content', theme);
    localStorage.setItem('theme', theme);
}

OMath.toggleTheme = () =>
{
    let theme = localStorage.getItem('theme');
    OMath.setTheme(theme === 'dark' ? 'light' : 'dark');
}

(() =>
{
    let OMath = window.OMath;

    let tag = document.createElement('meta');
        tag.setAttribute('name', 'color-scheme');
        tag.setAttribute('content', '');
    
    document.head.appendChild(tag);

    let preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
    let preferTheme = preferDark ? 'dark' : 'light';
    let theme = localStorage.getItem('theme');

    if (theme === null || theme === 'null')
        theme = preferTheme;
    
    OMath.setTheme(theme);
})();