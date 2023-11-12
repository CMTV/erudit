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

    bookTocs:
    {
        [bookId: string]: HTMLElement
    }

    bookTitles:
    {
        [bookId: string]: string
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

        this.setupBookClickLogic();

        // Back to the global view
        this.views.book.querySelector(':scope .controls > .navButtons > .back').addEventListener('click', () => this.setView(this.views.global));

        // Initial book (if present)
        let initialBookToc = this.views.book.querySelector('.bookToc') as HTMLElement;
        if (initialBookToc)
        {
            let initialBookId = initialBookToc.getAttribute('data-book-id');
            this.initBookToc(initialBookId, document.documentElement.getAttribute('data-topic'));

            this.bookTocs[initialBookId] = initialBookToc;
        }
    }

    setupBookClickLogic()
    {
        this.bookTocs = {};

        this.views.global.querySelectorAll('.tocItem > a').forEach(e => {
            let bookId = e.closest('.tocItem').getAttribute('data-id');
            e.addEventListener('click', () =>
            {
                if (bookId in this.bookTocs)
                {
                    this.setCurrentBookToc(bookId);
                    this.setView(this.views.book);
                }
                else
                {
                    this.setView(this.views.loading);
                    fetch('/site/book-tocs/' + bookId + '.html')
                        .then(response => response.text())
                        .then(htmlToc =>
                        {
                            this.views.book.querySelector(':scope > .inner').insertAdjacentHTML('beforeend', htmlToc);
                            this.bookTocs[bookId] = this.views.book.querySelector(`.bookToc[data-book-id="${bookId}"]`);
                            this.initBookToc(bookId);
                            this.setCurrentBookToc(bookId);
                            this.setView(this.views.book);
                        });
                }
            });
        });
    }

    setCurrentBookToc(bookId: string)
    {
        Object.values(this.bookTocs).forEach(tocElement => tocElement.removeAttribute('data-current'));
        this.bookTocs[bookId].setAttribute('data-current', '');
        this.views.book.querySelector('.bookTitle').innerHTML = this.views.global.querySelector(`.tocItem[data-id="${bookId}"] > a > .label`).innerHTML;
        this.views.book.querySelector('.controls > .navButtons > .home').setAttribute('href', `/book/${bookId}`);
    }

    setView(view: HTMLElement)
    {
        this.viewContainer.setAttribute('data-view', view.getAttribute('data-view'));
    }

    initBookToc(bookId: string, accentId: string = null)
    {
        // THIS WILL LOOK HORRIBLE WITH SECTION OPEN/CLOSE ANIMATIONS!
        // MAKE THIS SERVER-SIDE

        let toc = this.views.book.querySelector(`.bookToc[data-book-id="${bookId}"]`);

        // Sections
        toc.querySelectorAll('.tocSection > .tocItem > a').forEach(e => e.addEventListener('click', function ()
        {
            this.closest('.tocSection').toggleAttribute('data-open');
        }));

        // Highlighting specified item
        if (accentId)
        {
            let currentTocItem = toc.querySelector(`.tocItem[data-id="${accentId}"]`);
            if (currentTocItem)
            {
                currentTocItem.setAttribute('data-current', '');

                let parent = currentTocItem;
                while (parent != null)
                {
                    if (parent.classList.contains('tocItem'))
                        parent.setAttribute('data-accent', '');
                    
                    if (parent.classList.contains('tocSection'))
                    {
                        parent.setAttribute('data-open', '');
                        parent.querySelector(':scope > .tocItem').setAttribute('data-accent', '');
                    }

                    parent = parent.parentElement;
                }
            }
        }
    }
}