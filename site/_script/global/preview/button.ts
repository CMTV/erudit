class Button
{
    element: HTMLElement;
    onClick: () => any;

    constructor(buttonElement: HTMLElement)
    {
        this.element = buttonElement;
        this.element.addEventListener('click', () => this.onClick && this.canClick() && this.onClick());
    }

    protected canClick()
    {
        return true;
    }
}

class DisablableButton extends Button
{
    title: string;

    constructor(buttonElement: HTMLElement)
    {
        super(buttonElement);
        this.title = this.element.getAttribute('title');
    }

    setDisabled(disabled: boolean)
    {
        this.element.classList.toggle('disabled', disabled);

        if (disabled)
            this.element.removeAttribute('title');
        else
            this.element.setAttribute('title', this.title);
    }

    protected canClick()
    {
        return !this.element.classList.contains('disabled');
    }
}

//
//
//

export class BackButton extends DisablableButton {}

export class GotoButton extends DisablableButton
{
    setSource(source: string)
    {
        this.setDisabled(!source);
        this.element.setAttribute('href', source ? source : '');
    }
}

export enum MiniButtonState
{
    Collapse = 'collapse',
    Expand = 'expand'
}

export class MiniButton extends Button
{
    setState(state: MiniButtonState)
    {
        this.element.dataset.state = state;
        this.element.setAttribute('title', this.element.getAttribute(`data-label-${state}`));
    }
}

export class ExitButton extends Button {}