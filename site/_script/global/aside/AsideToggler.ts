import OpenButton from "./OpenButton"

export default class AsideToggler
{
    asides: 
    {
        major: HTMLElement;
        minor: HTMLElement;
    }

    openButtons:
    {
        major: OpenButton;
        minor: OpenButton;
    }

    previewLock: boolean;

    constructor()
    {
        // Asides
        {
            this.asides = <any>{};
            this.asides.major = document.querySelector('body > aside.major');
            this.asides.minor = document.querySelector('body > aside.minor');
        }
  
        // Open Buttons
        {
            this.openButtons = <any>{};
            this.openButtons.major = new OpenButton(document.querySelector('body > main > .bottomSticky > .asideControls > .majorOpen'));
            this.openButtons.minor = new OpenButton(document.querySelector('body > main > .bottomSticky > .asideControls > .minorOpen'));
        }
        
        // Open Button Click Logic
        {
            this.openButtons.major.onClick = () => this.toggleAside(this.asides.major, true);
            this.openButtons.minor.onClick = () => this.toggleAside(this.asides.minor, true);
        }

        // Main Click
        document.querySelector('body > main').addEventListener('click', e =>
        {
            let path = e.composedPath();

            for (let i = 0; i < path.length; i++)
            {
                if (path[i] == this.openButtons.major.button)
                    return;

                if (path[i] == this.openButtons.minor.button)
                    return;
            }

            if (this.asides.major.hasAttribute('data-showing') || this.asides.minor.hasAttribute('data-showing'))
                this.hideAsides();
        });

        // Handling Preview
        {
            let preview = document.querySelector('#preview');

            preview.addEventListener('screen', () =>
            {
                this.previewLock = true;
                this.updateOpenButtons();
            });

            preview.addEventListener('close', () =>
            {
                this.previewLock = false;
                this.updateOpenButtons();
            });
        }
    }

    updateOpenButtons()
    {
        let lock = false;

        if (this.asides.major.hasAttribute('data-showing'))
            lock = true;

        if (this.asides.minor.hasAttribute('data-showing'))
            lock = true;

        if (document.querySelector('#preview').hasAttribute('style') || this.previewLock)
            lock = true;

        //

        this.openButtons.major.toggleLock(lock);
        this.openButtons.minor.toggleLock(lock);
    }

    toggleAside(aside: HTMLElement, showing: boolean)
    {
        if (showing)
            aside.setAttribute('data-showing', '');
        else
            aside.removeAttribute('data-showing');

        this.updateOpenButtons();
    }

    hideAsides()
    {
        this.toggleAside(this.asides.major, false);
        this.toggleAside(this.asides.minor, false);

        this.updateOpenButtons();
    }
}