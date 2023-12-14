
import { lightbox } from './lightbox.js';

import axios from 'axios';
import { API_URL, options }  from './api.js';
import Notiflix from 'notiflix';
import { elements } from './elements';


const { galleryEl, searchInput, searchForm, loaderEl } = elements;

let totalHits = 0;
let isLoadingMore = false;
let reachedEnd = false;

searchForm.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', onScrollHandler);
document.addEventListener('DOMContentLoaded', hideLoader);

function showLoader() {
    loaderEl.style.display = 'block';
}

function hideLoader() {
    loaderEl.style.display = 'none';
}

function renderGallery(hits) {
    const markup = hits
        .map(item => {
            return `<a href="${item.largeImageURL}" class="lightbox">
        <div class="photo-card">
            <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    ${item.likes}
                </p>
                <p class="info-item">
                    <b>Views</b>
                    ${item.views}
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    ${item.comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    ${item.downloads}
                </p>
            </div>
        </div>
    </a>`;
        })
        .join('');
    galleryEl.insertAdjacentHTML('beforeend', markup);
    if (options.params.page * options.params.per_page >= totalHits) {
        if (!reachedEnd) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            reachedEnd = true;
        }
    }
    lightbox.refresh();
}

async function loadMore() {
    isLoadingMore = true;
    options.params.page += 1;
    try {
        showLoader();
        const response = await axios.get(API_URL, options);
        const hits = response.data.hits;
        renderGallery(hits);
      } catch (err) {
        Notiflix.Notify.failure(err);
        hideLoader();
      } finally {
        hideLoader();
        isLoadingMore = false; 
    }
}

function onScrollHandler() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollThereshold = 300;
    if (scrollTop + clientHeight >= scrollHeight - scrollThereshold &&
        galleryEl.innerHTML !== '' &&
        !isLoadingMore &&
        !reachedEnd) {
        loadMore();
        }
}

async function onFormSubmit(e) {
    e.preventDefault();
    options.params.q = searchInput.value.trim();
    if (options.params.q === '') {
      return;
    }
    options.params.page = 1;
    galleryEl.innerHTML = '';
    reachedEnd = false;
  
    try {
      showLoader();
      const response = await axios.get(API_URL, options);
      totalHits = response.data.totalHits;
      const hits = response.data.hits;
      if (hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        renderGallery(hits);
      }
      searchInput.value = '';
      hideLoader();
    } catch (err) {
      Notify.failure(err);
      hideLoader();
    }
  }