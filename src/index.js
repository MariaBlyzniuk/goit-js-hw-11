// Your API key: 28382412-95b249a99748e6aa5e93eddbe
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages, resetPages } from './fetch_images';


const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery')
const btnLoadMoreRef = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionsDelay: 250,
})

formRef.addEventListener('submit', onFormSubmit);
btnLoadMoreRef.addEventListener('click', onClickLoadMoreBtn);

let searchImg = '';
async function onFormSubmit(e) {
    e.preventDefault();
  clearCardsContainer();
  resetPages();

    searchImg = e.currentTarget.searchQuery.value.trim();
    console.log(searchImg);

    const {hits} = await fetchImages(searchImg);
    // console.log(data);
    e.target.reset();

    if (hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");

    }
  renderCards(hits);
  lightbox.refresh();
}

function createCards(cards) {
    return cards.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `<div class="photo-card">
    <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
  </a>
</div>`).join('');
}


function renderCards(cards) {
    galleryRef.insertAdjacentHTML('beforeend', createCards(cards))
}

function clearCardsContainer() {
    galleryRef.innerHTML = '';
} 
async function onClickLoadMoreBtn() {
  console.log('onClickLoadMoreBtn')
  const { hits } = await fetchImages(searchImg);
  renderCards(hits);
  lightbox.refresh();
}