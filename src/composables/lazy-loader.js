/**
 * Lazy loads images using data-src attribute
 * @param {HTMLElement[]} elements
 * @param {String} scrollMargin
 */
export function useLazyLoadImages (elements, scrollMargin = '1000px') {
    const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.dataset.src) {
                    console.warn('Use data-src attribute for lazy loading images')
                    intersectionObserver.unobserve(entry.target);
                    return;
                }

                entry.target.src = entry.target.dataset.src;
                delete entry.target.dataset.src;
                intersectionObserver.unobserve(entry.target);
            }
        })
    }, {
        scrollMargin
    });

    elements.forEach(entry => {
        intersectionObserver.observe(entry)
    });
}