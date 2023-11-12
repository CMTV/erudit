export class LiveTocPos
{
    updateAllowed = true;
    updateDelay = 150;

    idToHeader:     { [id: string]: Element } = {};
    idToElem:       { [id: string]: Element } = {};
    idToTocElem:    { [id: string]: Element } = {};

    constructor(tocElem: Element)
    {
        this.fillMaps(tocElem);

        let delayTimeout;
        ['resize', 'scroll'].forEach(eventName =>
        {
            window.addEventListener(eventName, () =>
            {
                clearTimeout(delayTimeout);
                delayTimeout = setTimeout(() => { this.updateTocPos(); }, this.updateDelay);
            });
        });

        window.addEventListener('hashchange', () => { this.updateTocPos() });

        this.setupForcedToc();

        this.updateTocPos();
    }

    fillMaps(tocElem: Element)
    {
        for (tocElem of tocElem.children)
        {
            let id = tocElem.querySelector(':scope > a').getAttribute('href').slice(1);
            let isH = ['heading', 'auto-heading'].includes(id.split(':')[0]);

            this.idToTocElem[id] = tocElem;

            let elem = document.getElementById(id);

            if (isH)
                this.idToHeader[id] = elem;
            else
                this.idToElem[id] = elem;
        }
    }

    setupForcedToc()
    {
        let allowedTimeout;

        Object.keys(this.idToTocElem).forEach(id =>
        {
            let tocElem = this.idToTocElem[id];

            tocElem.addEventListener('click', () =>
            {
                clearTimeout(allowedTimeout);
                allowedTimeout = setTimeout(() => { this.updateAllowed = true }, this.updateDelay + 100);

                this.updateAllowed = false;
                this.clearCurrentPos();
                this.setCurrentPos(id);
            });
        });
    }

    //
    //
    //

    updateTocPos()
    {
        if (!this.updateAllowed)
            return;

        this.clearCurrentPos();

        if (!this.hasVScrollbar())
            return;

        let headers = Object.values(this.idToHeader);
        if (headers.length)
        {
            let currentHeaderId = this.getCurrentHeaderIdFrom(headers);
            this.setCurrentPos(currentHeaderId);
        }

        let elements = Object.values(this.idToElem);
        if (elements.length)
        {
            let currentElementId = this.getCurrentElementIdFrom(elements);

            if (currentElementId)
                this.setCurrentPos(currentElementId);
        }
    }

    //
    //
    //

    getCurrentHeaderIdFrom(headers: Element[])
    {
        let edge = window.scrollY + 300;

        let iLeft = 0;
        let iRight = headers.length;
        let iCurrent = 0;

        while (iLeft < iRight)
        {
            let iMiddle = (iLeft + iRight)/2|0;
            let eMiddle = headers[iMiddle];
            let eMiddleY = eMiddle.getBoundingClientRect().top + window.scrollY;

            if (edge <= eMiddleY)
                iRight = iMiddle;
            else
            {
                iCurrent = iMiddle;
                iLeft = iMiddle + 1;
            }
        }

        return headers[iCurrent].id;
    }

    getCurrentElementIdFrom(elements: Element[])
    {
        let iLeft = 0;
        let iRight = elements.length;

        let eCurrent = null;
        let currentDelta = -1;

        while (iLeft < iRight)
        {
            let iMiddle = (iLeft + iRight)/2|0;
            let eMiddle = elements[iMiddle];
            
            let eRect = eMiddle.getBoundingClientRect();
            let eTop = eRect.top;
            let eBot = eRect.bottom;

            if (eBot < 0)
            {
                iLeft = iMiddle + 1;
                continue;
            }

            if (eTop > document.documentElement.clientHeight)
            {
                iRight = iMiddle;
                continue;
            }

            let delta = eBot - 300;
            if (Math.abs(delta) < currentDelta || currentDelta === -1)
            {
                currentDelta = Math.abs(delta);
                eCurrent = eMiddle;
            }

            if (delta < 0)
                iLeft = iMiddle + 1;
            else
                iRight = iMiddle;
        }

        if (!eCurrent)
            return null;

        return eCurrent.id;
    }

    setCurrentPos(id: string)
    {
        this.idToTocElem[id].setAttribute('data-current', '');
    }

    clearCurrentPos()
    {
        Object.values(this.idToTocElem).forEach(tocElem => tocElem.removeAttribute('data-current'));
    }

    hasVScrollbar()
    {
        return window.innerWidth > document.documentElement.clientWidth;
    }
}