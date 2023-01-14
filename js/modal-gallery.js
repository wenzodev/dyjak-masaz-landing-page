import createModal from "./createModal.js";
createModal();

// Global query selectors for tab functionality
const modalableImages = document.querySelectorAll('[data-modal="true"]');
const modalContainer = document.querySelector('.modal-container');
const modalTrack = document.querySelector('.modal__image-container');
const indicatorContainer = document.querySelector('.modal__indicator-container');
// all galleries will share this option
let transitionSpeed;
let galleries;
// for each gallery different images
let modalImages;
let modalIndicators;
let currentIndex;
// last item in the array
let lastIndex;
// transition
let isMoving = false;

class Modal {
    constructor(modal) {
        this.modal = modal;
        this.attachEventListeners();
    }

    openModal() {
        modalableImages.forEach((btn) => (btn.tabIndex = "-1"));
        this.modal.removeAttribute("hidden");
        this.modal.classList.add("active");
    }
    closeModal() {
        modalTrack.style.transition = 'none'
        isMoving = false
        modalableImages.forEach((btn) => (btn.tabIndex = "0"));
        this.modal.setAttribute("hidden", "true");
        this.modal.classList.remove("active");
    }

    attachEventListeners() {
        this.modal.addEventListener("click", (e) => {
            e.target === e.currentTarget ||
                e.target.classList.contains("modal__close")
                ? this.closeModal()
                : null;
        });
    }
}

// Object oriented option
// core of the slider functions
const modal = new Modal(modalContainer);

function showActiveIndictaor() {
    modalIndicators.forEach((i) => i.classList.remove("active")); // i for indicator
    switch (currentIndex) {
        case 0:
            modalIndicators[modalIndicators.length - 1].classList.add("active");
            break;
        case lastIndex - 1:
            modalIndicators[0].classList.add("active");
            break;
        default:
            modalIndicators
                .find((i) => i.dataset.index == currentIndex - 1)
                .classList.add("active");
            break;
    }
}

// adding a gallery functionality to moving left and right
function moveGallery() {
    modalTrack.style.transform = `translateX(${currentIndex * -100}%`;
    showActiveIndictaor();
}

function addImagesAndIndicatorsToGallery(arrayOfImages) {
    // add images to gallery
    modalTrack.innerHTML = [
        arrayOfImages[arrayOfImages.length - 1],
        ...arrayOfImages,
        arrayOfImages[0],
    ]
        .map(
            (img) => `<img class="modal__image" src="${img.src}" alt="${img.alt}">`
        )
        .join("");
    // add indicators to gallery
    indicatorContainer.innerHTML = arrayOfImages.map(
        (i, index) =>
            `<button class="modal__indicator" data-index=${index}></button>`
    )
        .join('');
    // .join as it is a string

    // return both for destructuring
    return [
        [...document.querySelectorAll('.modal__image')],
        [...document.querySelectorAll('.modal__indicator')],
    ];
}

function updateGallery(galleryImages) {
    [modalImages, modalIndicators] =
        addImagesAndIndicatorsToGallery(galleryImages);
    currentIndex = 1;
    lastIndex = modalImages.length;
    moveGallery();
}

// eventlisteners
function attachOpenGalleryEventListeners() {
    modalableImages.forEach((btn) => {
        btn.addEventListener('mouseenter', () => {
            // updateGallery(gallery)
            updateGallery(
                galleries.find((g) => g.name === btn.dataset.gallery).images)
        })
        btn.addEventListener('click', () => {
            // updateGallery(gallery)
            updateGallery(
                galleries.find((g) => g.name === btn.dataset.gallery).images)
            modal.openModal();
        })
    })
}

function attachArrowEventListeners() {
    document.querySelectorAll('.modal__arrow').forEach((arrow) =>
        arrow.addEventListener('click', (e) => {
            if (isMoving === true) { return }
            isMoving = true
            modalTrack.style.transition = `transform ${transitionSpeed}ms cubic-bezier(0.82, 0.02, 0.39, 1.01)`
            e.target.id === 'right' ? currentIndex++ : currentIndex--;
            moveGallery();
        })
    );
}

function attachIndicatorEventListeners() {
    indicatorContainer.addEventListener('click', (e) => {
        if (e.currentTarget === e.target) { return }
        if (isMoving === true) { return }
        isMoving = true
        modalTrack.style.transition = `transform ${transitionSpeed}ms cubic-bezier(0.82, 0.02, 0.39, 1.01)`
        currentIndex = Number(e.target.dataset.index) + 1
        moveGallery()
    })
}

function attachTransitionEndListener() {
    modalTrack.addEventListener('transitionend', () => {
        isMoving = false
        if (currentIndex === 0) {
            modalTrack.style.transition = 'none'
            currentIndex = lastIndex - 2
            moveGallery()
        }
        if (currentIndex === lastIndex - 1) {
            modalTrack.style.transition = 'none'
            currentIndex = 1
            moveGallery()
        }
    })
}

// check keycode.info for code-keys = to program the esckey
window.addEventListener("keyup", (e) => {
    if (e.key === "Escape" && modalContainer.classList.contains('active')) {
        modal.closeModal();
    }
});

// async await function - initializer the gallery
export default async function initGallery(endpoint, options) {
    await fetch(endpoint)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            galleries = data;
            [modalImages, modalIndicators] =
                addImagesAndIndicatorsToGallery(
                    data.map((gallery) => gallery.images[0]))
            transitionSpeed = options?.speed || 250;
            attachOpenGalleryEventListeners();
            // arrows functionality
            attachArrowEventListeners();
            attachIndicatorEventListeners();
            attachTransitionEndListener();
        })
        .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
}
