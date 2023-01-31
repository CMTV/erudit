import { initAccentBlocksIn } from "./ab";
import { initGalleriesIn } from "./gallery";
import { initPreviewLinksIn } from "./link";
import { initTasksIn } from "./task";

declare let PhotoSwipeLang, PhotoSwipe, PhotoSwipeLightbox;

export function initContentLogicIn(element: HTMLElement)
{
    initAccentBlocksIn(element);
    initGalleriesIn(element);
    initTasksIn(element);
    initPreviewLinksIn(element);

    element.querySelectorAll('.image').forEach(imgElem => initPhotoSwipeIn(imgElem));
}

function initPhotoSwipeIn(element: Element)
{
    let animDuration = 250;

    let options = {
        wheelToZoom: true,
        showAnimationDuration: animDuration,
        hideAnimationDuration: animDuration,
        ...PhotoSwipeLang
    }

    let lightbox = new PhotoSwipeLightbox({
        gallery: element,
        children: 'a[data-pswp-single]',
        pswpModule: PhotoSwipe,
        ...options
    });

    lightbox.on('afterSetContent', function (e) {
        let isInvertible = lightbox.pswp.currSlide.data.element.querySelector('img').classList.contains('invertible');

        if (isInvertible)
            e.slide.image.classList.add('_invert');
    });

    lightbox.on('uiRegister', function () {
        lightbox.pswp.ui.registerElement({
            name: 'custom-caption',
            order: 9,
            isButton: false,
            appendTo: 'root',
            onInit: (el) => {
                lightbox.pswp.on('change', () => {
                    const currSlideElement = lightbox.pswp.currSlide.data.element;
                    let captionHTML = currSlideElement.querySelector('img').parentElement.parentElement.querySelector('.caption')?.innerHTML;
                    el.innerHTML = captionHTML || '';
                    el.classList.toggle('_noCaption', !captionHTML);
                });
            }
        });
    });

    lightbox.init();
}