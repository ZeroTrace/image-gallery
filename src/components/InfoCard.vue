<template>
  <div class="card">
    <h2 class="card__title">Project description: </h2>
    <p class="card__description">
      This is a simple image gallery. The images are lazy loaded to improve performance.
      You can scroll through images using the arrow keys, clicking an image,
      pressing "Enter" or "Space" while an image is selected opens a
      modal dialog, you can close the modal dialog by pressing "Escape".
    </p>
  </div>
</template>

<style scoped>
.card {
    max-width: 768px;
    border: 1px solid var(--primary-color);
    padding: 1rem;
    border-radius: 1rem;
    margin: 0 auto;
    background-color: var(--primary-color);
    color: white;
}

.card__title {
    font-size: 1.5rem;
    font-weight: 600;
    padding-bottom: 0.5rem;
}
</style>