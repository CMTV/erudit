class Gallery
{
    selectorImages: NodeListOf<Element>;
    displayImages: NodeListOf<Element>;

    constructor(root: Element)
    {
        this.selectorImages = root.querySelectorAll(':scope > .selector > .inner > .image');
        this.displayImages = root.querySelectorAll(':scope > .display > .displayImage');

        this.selectorImages.forEach((sImg, i) => sImg.addEventListener('click', () =>
        {
            this.selectorImages.forEach(_sImg => _sImg.removeAttribute('data-current'));
            sImg.setAttribute('data-current', '');

            this.displayImages.forEach(dImg => dImg.removeAttribute('data-current'));
            this.displayImages[i].setAttribute('data-current', '');
        }));
    }
}

export function initGalleriesIn(element: Element)
{
    element.querySelectorAll('.gallery').forEach(gallery => new Gallery(gallery));
}