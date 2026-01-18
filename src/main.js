import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  showLoadMoreStatus,
  hideLoadMoreStatus,
  setLoadMoreLoading,
} from './js/render-functions';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import errorIcon from './img/bi_x-octagon.svg';

const form = document.querySelector('.form');
const input = form.elements['search-text'];
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
const PER_PAGE = 15;
let totalHits = 0;
let isLoading = false;

async function fetchAndRender(query, page) {
  if (!query) return;
  isLoading = true;
  showLoader();
  hideLoadMoreButton();

  // Show status below Load more when loading additional pages
  if (page > 1) showLoadMoreStatus();
  // Also change button text to Loading...
  setLoadMoreLoading(true);

  try {
    const data = await getImagesByQuery(query, page, PER_PAGE);

    // Если нет результатов для первого запроса
    if (data.hits.length === 0 && page === 1) {
      iziToast.error({
        message:
          'Sorry, there are no images matching <span class="span-text">your search query. Please, try again!</span>',
        position: 'topRight',
        iconUrl: errorIcon,
      });
      totalHits = 0;
      return;
    }

    // Добавляем новые элементы в DOM
    createGallery(data.hits);

    // Прокрутка страницы плавно после подгрузки следующей страницы
    if (page > 1) {
      const firstCard = document.querySelector('.gallery .gallery-item');
      if (firstCard) {
        const { height } = firstCard.getBoundingClientRect();
        window.scrollBy({
          top: height * 4,
          behavior: 'smooth',
        });
      }
    }

    // totalHits используется для управления пагинацией
    totalHits = data.totalHits || 0;

    const loadedSoFar = page * PER_PAGE;

    if (loadedSoFar < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      if (totalHits > 0) {
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong: ' + error.message,
      position: 'topRight',
      iconUrl: errorIcon,
    });
  } finally {
    isLoading = false;
    hideLoader();
    hideLoadMoreStatus();
    setLoadMoreLoading(false);
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();

  const query = input.value.trim();

  if (!query) {
    iziToast.error({
      message: 'Please enter a search term!',
      position: 'topRight',
      iconUrl: errorIcon,
    });
    return;
  }

  // Сброс состояния перед новым поиском
  currentQuery = query;
  currentPage = 1;
  totalHits = 0;
  clearGallery();
  hideLoadMoreButton();

  await fetchAndRender(currentQuery, currentPage);
});

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', async () => {
    if (isLoading) return; // защита от множественных кликов
    currentPage += 1;
    await fetchAndRender(currentQuery, currentPage);
  });
}
