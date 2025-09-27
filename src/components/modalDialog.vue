<script setup>
import { inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useEventListener } from "../composables/event.js";

const modalDialog = ref(null);
const image = inject('selectedImage')

function handleKeyDown (e) {
    if (!modalDialog.value) return;
    if (e.key !== 'Escape') return;

    modalDialog.value.close();
    image.value = null;
}

useEventListener(window, 'keydown', handleKeyDown)

watch(image, async () => {
    await nextTick();
    modalDialog.value && modalDialog.value.showModal();
})
</script>

<template>
  <Teleport to="body">
    <dialog v-if="image" ref="modalDialog" class="modal-dialog__container">
      <h2 class="modal-dialog__title">Image title</h2>
      <div class="modal-dialog__image-wrapper">
        <img :alt="`${image.author}`" :src="image.download_url" class="modal-dialog__image">
      </div>
      <small class="modal-dialog__author">Author: {{ image.author }}</small>
    </dialog>
  </Teleport>
</template>

<style scoped>
.modal-dialog__container {
    width: 100dvw;
    height: 100dvh;
    max-width: max-content;
    max-height: 768px;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    overflow: hidden;
    border: none;
    border-radius: 10px;

    padding: 64px 8px 36px 8px;
}

.modal-dialog__container::backdrop {
    background: rgba(0, 0, 0, 0.80);
}

.modal-dialog__image-wrapper {
    width: 100%;
    height: 100%;
}

.modal-dialog__image {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
}

.modal-dialog__title {
    position: absolute;
    z-index: 1;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    user-select: none;
}

.modal-dialog__author {
    position: absolute;
    bottom: 10px;
    right: 10px;
    user-select: none;
}
</style>