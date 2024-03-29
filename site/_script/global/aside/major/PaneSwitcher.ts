import AsideToggler from "../AsideToggler";

export default class PaneSwitcher
{
    asideMajor: HTMLElement;

    constructor(toggler: AsideToggler)
    {
        this.asideMajor = document.querySelector('#__erudit > aside.major');

        let registerButton = (button: Element, openAside: boolean) =>
        {
            let name = button.getAttribute('data-target');
            button.addEventListener('click', () =>
            {
                this.asideMajor.dispatchEvent(new CustomEvent("pane-switch", {
                    detail: {
                        targetPane:     name,
                        previousPane:   this.asideMajor.getAttribute('data-pane'),
                        openAside:      openAside,
                    }
                }));

                this.switchTo(name);
                if (openAside)
                    toggler.toggleAside(this.asideMajor, true);
            });
        }

        this.asideMajor.querySelectorAll(':scope .full > .paneSwitcher > .inner > button').forEach(button =>
        {
            registerButton(button, false);
        });

        this.asideMajor.querySelectorAll(':scope .mini > button').forEach(button =>
        {
            registerButton(button, true);
        });
    }

    switchTo(name: string)
    {
        this.asideMajor.setAttribute('data-pane', name);
    }
}