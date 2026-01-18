import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a');

export function createGallery(images) {
  const gallery = document.querySelector('.gallery');

  const markup = images
    .map(img => {
      return `
        <li class="gallery-item">
  <a href="${img.largeImageURL}">
    <img src="${img.webformatURL}" alt="${img.tags}">
  </a>
  <div class="info">
    <p><span class="label">Likes</span><span class="value">${img.likes}</span></p>
    <p><span class="label">Views</span><span class="value">${img.views}</span></p>
    <p><span class="label">Comments</span><span class="value">${img.comments}</span></p>
    <p><span class="label">Downloads</span><span class="value">${img.downloads}</span></p>
  </div>
</li>
`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
}

export function showLoader() {
  const loader = document.querySelector('.loader');
  loader.classList.remove('hidden');
}

export function hideLoader() {
  const loader = document.querySelector('.loader');
  loader.classList.add('hidden');
}

export function showLoadMoreButton() {
  const btn = document.querySelector('.load-more');
  if (!btn) return;
  btn.classList.remove('hidden');
  btn.disabled = false;
}

export function hideLoadMoreButton() {
  const btn = document.querySelector('.load-more');
  if (!btn) return;
  btn.classList.add('hidden');
  btn.disabled = true;
}

export function setLoadMoreLoading(isLoading) {
  const btn = document.querySelector('.load-more');
  if (!btn) return;

  // Don't change button text — only toggle disabled state so the label stays the same
  btn.disabled = Boolean(isLoading);
}

export function showLoadMoreStatus() {
  const el = document.querySelector('.load-more-status');
  if (!el) return;
  el.classList.remove('hidden');
}

export function hideLoadMoreStatus() {
  const el = document.querySelector('.load-more-status');
  if (!el) return;
  el.classList.add('hidden');
}
