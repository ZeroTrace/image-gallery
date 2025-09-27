<script setup>
import axios from "axios";
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import ModalDialog from "./components/modalDialog.vue";

const galleryScrollableContainer = ref(null);

const images = ref([]);
const selectedImage = shallowRef();
const canScrollLeft = ref(false);
const canScrollRight = ref(true);
const preventScrolling = ref(false);

function scrollGallery (direction) {
    if (preventScrolling.value) return;

    galleryScrollableContainer.value.scrollBy({
        left: direction === 'left' ? -1000 : 1000,
        behavior: 'smooth'
    })
}

function openModal (image) {
    preventScrolling.value = true;
    selectedImage.value = image;
}

function handleKeyDown (e) {
    const keyboardInteractionMap = {
        'Escape': () => {
            selectedImage.value = null;
            preventScrolling.value = false;
        },
        'ArrowLeft': (event) => {
            event.preventDefault();
            scrollGallery('left')
        },
        'ArrowRight': (event) => {
            event.preventDefault();
            scrollGallery('right')
        },
    }

    Object.keys(keyboardInteractionMap).includes(e.key) && keyboardInteractionMap[e.key](event);
}

function handleScroll () {
    preventScrolling.value = true;
}

function handleScrollEnd () {
    canScrollLeft.value = galleryScrollableContainer.value.scrollLeft > 0;
    canScrollRight.value = galleryScrollableContainer.value.scrollLeft < galleryScrollableContainer.value.scrollWidth - galleryScrollableContainer.value.clientWidth;
    preventScrolling.value = false;
}

onMounted(async () => {
    window.addEventListener('keydown', handleKeyDown)
    images.value = (await axios.get('https://picsum.photos/v2/list?limit=100'))?.data || [];
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown)
})

watch(images, async () => {
    await nextTick();
    const lazyImageElements = document.querySelectorAll('.gallery__image');
    const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
                delete entry.target.dataset.src;
                intersectionObserver.unobserve(entry.target);
            }
        })
    }, {
        scrollMargin: '1000px'
    });

    lazyImageElements.forEach(entry => {
        intersectionObserver.observe(entry)
    });
})
</script>

<template>
  <ModalDialog :image="selectedImage" />
  <main>
    <h1 class="main-title">Image gallery</h1>
    <div class="card">
      <h2 class="card__title">Description: </h2>
      <p class="card__description">This is a simple image gallery. You can scroll through images using the arrow keys,
        clicking
        an image,
        pressing
        "Enter" or "Space" while an image is selected opens a modal dialog, you can close the modal dialog by pressing
        "Escape".</p>
    </div>
    <div class="gallery">
      <button :disabled="!canScrollLeft" class="gallery-button gallery-button--left" @click="scrollGallery('left')">
        <span class="material-symbols-outlined">keyboard_arrow_left</span>
      </button>
      <div ref="galleryScrollableContainer" class="gallery__container" @scroll="handleScroll"
           @scrollend="handleScrollEnd">
        <div
          v-for="image in images"
          :key="image.id"
          class="gallery__image-wrapper"
        >
          <img
            :alt="`${image.author}`"
            :data-src="image.download_url"
            class="gallery__image"
            src=""
            tabindex="0"
            @click="openModal(image)"
            @keydown.space="openModal(image)"
            @keydown.enter="openModal(image)"
          >
        </div>
      </div>
      <button :disabled="!canScrollRight" class="gallery-button gallery-button--right" @click="scrollGallery('right')">
        <span class="material-symbols-outlined">keyboard_arrow_right</span>
      </button>
    </div>
  </main>
</template>

<style scoped>
main {
    display: flex;
    padding: 1rem;
    flex-direction: column;
    gap: 2rem;
}

.main-title {
    text-align: center;
}

.gallery {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.gallery__container {
    display: flex;
    align-items: center;
    gap: 1rem;
    overflow-x: auto;
    padding: 4px;
}

.gallery__container::-webkit-scrollbar {
    display: none;
    scrollbar-width: none;
}

.gallery__image-wrapper {
    flex-shrink: 0;
    width: 20%;
    height: 100%;
    cursor: pointer;
}

.gallery__image {
    width: 100%;
    height: 100%;
    object-fit: fill;
}

.gallery__image:focus-visible {
    outline: 5px solid var(--accent-color);
}

.gallery-button {
    flex-shrink: 0;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgb(20, 20, 20);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 4px rgba(180, 160, 255, 0.253);
    cursor: pointer;
    transition-duration: 0.3s;
}

.gallery-button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

.card {
    max-width: 768px;
    border: 1px solid var(--primary-color);
    padding: 1rem;
    border-radius: 1rem;
    margin: 0 auto;
}

.card__title {
    font-size: 1.5rem;
    font-weight: 600;
    padding-bottom: 0.5rem;
}

p {
    max-width: 75ch;
}
</style>