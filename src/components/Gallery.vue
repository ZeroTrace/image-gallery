<script setup>
import { inject, nextTick, ref, watch } from "vue";
import { useEventListener } from "../composables/event.js";
import { useLazyLoadImages } from "../composables/lazy-loader.js";

const props = defineProps({
    images: {
        type: Object,
        default: () => ({}),
    },
});

const galleryScrollableContainer = ref(null);

const canScrollLeft = ref(false);
const canScrollRight = ref(true);
const preventScrolling = ref(false);
const selectedImage = inject('selectedImage');

function scrollGallery (direction) {
    if (preventScrolling.value) return;

    galleryScrollableContainer.value.scrollBy({
        left: direction === 'left' ? -1000 : 1000,
        behavior: 'smooth'
    })
}

function handleScroll () {
    preventScrolling.value = true;
}

function handleScrollEnd () {
    canScrollLeft.value = galleryScrollableContainer.value.scrollLeft > 0;
    canScrollRight.value = galleryScrollableContainer.value.scrollLeft < galleryScrollableContainer.value.scrollWidth - galleryScrollableContainer.value.clientWidth;
    preventScrolling.value = false;
}

function handleKeyDown (e) {
    const keyboardInteractionMap = {
        'ArrowLeft': (event) => {
            event.preventDefault();
            scrollGallery('left')
        },
        'ArrowRight': (event) => {
            event.preventDefault();
            scrollGallery('right')
        },
    }

    Object.keys(keyboardInteractionMap).includes(e.key) && keyboardInteractionMap[e.key](e);
}

function handleClick (image) {
    preventScrolling.value = true;
    selectedImage.value = image;
}

useEventListener(window, 'keydown', handleKeyDown)

watch(() => props.images, async () => {
    await nextTick();
    const lazyImageElements = document.querySelectorAll('.gallery__image');
    useLazyLoadImages(lazyImageElements);
})

watch(selectedImage, () => {
    if (!!selectedImage.value) return;

    preventScrolling.value = false;
})
</script>

<template>
  <div class="gallery">
    <button :disabled="!canScrollLeft" class="gallery-button gallery-button--left" @click="scrollGallery('left')">
      <span class="material-symbols-outlined">keyboard_arrow_left</span>
    </button>
    <div
      ref="galleryScrollableContainer"
      class="gallery__container"
      @scroll="handleScroll"
      @scrollend="handleScrollEnd"
    >
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
          @click="handleClick(image)"
          @keydown.space="handleClick(image)"
          @keydown.enter="handleClick(image)"
        >
      </div>
    </div>
    <button :disabled="!canScrollRight" class="gallery-button gallery-button--right" @click="scrollGallery('right')">
      <span class="material-symbols-outlined">keyboard_arrow_right</span>
    </button>
  </div>
</template>

<style scoped>
.gallery {
    display: flex;
    flex: 1;
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
    background-color: var(--secondary-color);
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

@media(max-width: 1800px) {
    .gallery__image-wrapper {
        width: 30%;
    }
}

@media(max-width: 1200px) {
    .gallery__image-wrapper {
        width: 50%;
    }
}

@media(max-width: 600px) {
    .gallery__image-wrapper {
        width: 100%;
    }
}
</style>