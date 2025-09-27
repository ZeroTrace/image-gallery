import { onMounted, onUnmounted } from "vue";

/**
 *
 * Sets the event listener for the target element *
 * @param {HTMLElement} target
 * @param {Event} event
 * @param {Function} callback
 */
export function useEventListener(target, event, callback) {
    onMounted(() => target.addEventListener(event, callback))
    onUnmounted(() => target.removeEventListener(event, callback))
}