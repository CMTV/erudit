export default class Screen
{
    id: string;
    element: HTMLElement;
    inner: HTMLElement;

    onHeightChange: (height: number) => any;

    private observer: ResizeObserver;

    constructor(id: string, raw: string | HTMLElement)
    {
        this.id = id;

        let element: HTMLElement;

        if (typeof raw === 'string')
        {
            let screen = document.createElement('div');
                screen.className = 'screen';
            
            let inner = document.createElement('div');
                inner.className = 'inner';
                inner.innerHTML = raw;

            screen.appendChild(inner);

            element = screen;
        }
        else element = raw;

        this.element =  element;
        this.inner =    this.element.querySelector(':scope > .inner');
        this.observer = new ResizeObserver(() => this.onHeightChange && this.onHeightChange(this.getHeight()));
    }

    setCurrent(current: boolean)
    {
        if (current)
        {
            this.element.setAttribute('data-current', '');
            this.observer.observe(this.inner);
        }
        else
        {
            this.element.removeAttribute('data-current');
            this.observer.unobserve(this.inner);
        }
    }

    getHeight()
    {
        return this.inner.offsetHeight;
    }
}