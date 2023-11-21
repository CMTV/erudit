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

        window.addEventListener('scroll', () =>
        {
            if (scrollY === 0)
            {
                this.toggleShowing(true);
                return;
            }

            let delta = scrollY - this.lastY;
            this.lastY = scrollY;

            if (delta === 0)
                return;

            if (delta > 0 && delta < 10)
                return;

            this.toggleShowing(delta < 0);
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