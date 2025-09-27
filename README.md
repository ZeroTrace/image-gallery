# Image gallery

This is an image gallery test project. 
The images are lazy loaded to improve performance.
You can scroll through images using the arrow keys,
clicking an image, pressing "Enter" or "Space" while an image is selected
opens a modal dialog, you can close the modal dialog by pressing "Escape".

The project uses fetch browser API to fetch the gallery images from the specified URL.

Common functionality is extracted into composables.

The shared styles are on `src/style.css` file while specific component styles are on the component's file.

## Running locally

For running the project just to follow the next steps 

1. Install the NPM dependencies:
    ```shell
      npm install
    ```
2. Run the dev server
    ```shell
      npm run dev
    ```
3. Open your preferred browser and navigate to [http://localhost:5173](http://localhost:5173)