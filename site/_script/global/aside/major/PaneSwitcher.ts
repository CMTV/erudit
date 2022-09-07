export default class PaneSwitcher
{
    buttons: { [name: string]: HTMLElement} = {};
    panes: { [name: string]: HTMLElement} = {};

    constructor()
    {
        let aside = document.querySelector('body > aside.major');

        aside.querySelectorAll(':scope > .full > .paneSwitcher > .inner > button').forEach((element: HTMLElement) =>
        {
            let name = element.getAttribute('data-target');

            this.buttons[name] = element;
            this.panes[name] = aside.querySelector(`:scope > .full > .panes > .pane[data-pane="${name}"]`);

            this.buttons[name].addEventListener('click', () => this.switchTo(name));
        });
    }

    switchTo(name: string)
    {
        if (!this.buttons[name] || !this.panes[name])
            throw new Error(`Unknown pane/button name '${name}'!`);

        Object.values(this.buttons).forEach(button => button.removeAttribute('data-current'));
        Object.values(this.panes).forEach(pane => pane.removeAttribute('data-current'));

        this.buttons[name].setAttribute('data-current', '');
        this.panes[name].setAttribute('data-current', '');
    }
}