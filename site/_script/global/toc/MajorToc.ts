import AsideToggler from "global/aside/AsideToggler";

export default class MajorToc
{
    viewContainer: HTMLElement;

    views:
    {
        global: HTMLElement;
        loading: HTMLElement;
        book: HTMLElement;
    }

    constructor(asideToggler: AsideToggler)
    {
        this.viewContainer = asideToggler.asides.major.querySelector(':scope .pane[data-pane="toc"] .viewContainer');

        // Views
        {
            this.views = <any>{};
            this.views.global =     this.viewContainer.querySelector(':scope > .view[data-view="global"]');
            this.views.loading =    this.viewContainer.querySelector(':scope > .view[data-view="loading"]');
            this.views.book =       this.viewContainer.querySelector(':scope > .view[data-view="book"]');
        }

        // Back to the global view
        this.views.book.querySelector(':scope .controls > .navButtons > .back').addEventListener('click', () => this.setView(this.views.global));
    }

    setView(view: HTMLElement)
    {
        this.viewContainer.setAttribute('data-view', view.getAttribute('data-view'));
    }
}