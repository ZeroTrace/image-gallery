<script setup>
import { onMounted, provide, shallowRef } from "vue";
import ModalDialog from "./components/modalDialog.vue";
import Gallery from "./components/Gallery.vue";
import InfoCard from "./components/InfoCard.vue";
import axios from "axios";

const selectedImage = shallowRef();
const images = shallowRef([]);

provide('selectedImage', selectedImage);

onMounted(async () => {
    images.value = (await axios.get('https://picsum.photos/v2/list?limit=100'))?.data || [];
})
</script>

<template>
  <ModalDialog/>
  <main class="main-container">
    <h1 class="main-container__title">Image gallery</h1>
    <InfoCard/>
    <Gallery :images="images"/>
  </main>
</template>

<style scoped>
.main-container {
    display: flex;
    padding: 1rem;
    flex-direction: column;
    gap: 2rem;
}

.main-container__title {
    text-align: center;
}
</style>