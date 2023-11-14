export default class OpenButton
{
    onClick = () => {};

    button: HTMLElement;

    private locked: boolean;
    private lastY: number;

    constructor(button: HTMLElement)
    {
        this.button = button;
        this.lastY = scrollY;

        this.button.addEventListener('click', () => this.onClick());

        if (scrollY === 0)
            this.toggleShowing(true);

        let scrollShowLocked = false;
        let scrollShowLockTimeout;
            
        window.addEventListener('scroll', () =>
        {
            if (scrollY < this.lastY)
            {
                scrollShowLocked = true;
                clearTimeout(scrollShowLockTimeout);
                scrollShowLockTimeout = setTimeout(() => scrollShowLocked = false, 150);
            }

            this.toggleShowing(scrollY === 0 || scrollShowLocked);
            this.lastY = scrollY;
        });

        window.addEventListener('resize', () => this.toggleShowing(scrollY === 0));
    }

    toggleLock(locked: boolean)
    {
        this.locked = locked;

        if (locked)
            this.toggleShowing(false);
        else
            this.toggleShowing(scrollY === 0);
    }

    private toggleShowing(showing: boolean)
    {
        if (showing && !this.locked)
            this.button.setAttribute('data-showing', '');
        else
            this.button.removeAttribute('data-showing');
    }
}