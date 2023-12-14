import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

export let lightbox = new SimpleLightbox('.lightbox', {
    captionsData: 'alt',
    captionDelay: 250,
    enableKeyboard: true,
    showCounter: false,
    scrollZoom: false,
    close: false,
  });