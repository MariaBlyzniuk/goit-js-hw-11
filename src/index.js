// Your API key: 28382412-95b249a99748e6aa5e93eddbe
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchImages, resetPages } from './fetch_images';


const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery')
const btnLoadMoreRef = document.querySelector('.btn-load-more');
const endCollectionText = document.querySelector('.end-collection-text');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionsDelay: 250,
});

formRef.addEventListener('submit', onFormSubmit);
btnLoadMoreRef.addEventListener('click', onClickLoadMoreBtn);

let searchImg = '';
let currentHits = 0;
async function onFormSubmit(e) {
  e.preventDefault();
  clearCardsContainer();
  resetPages();

    searchImg = e.currentTarget.searchQuery.value.trim();
    
  const data = await fetchImages(searchImg);
  currentHits = data.hits.length;
    
    e.target.reset();

  if (data.hits.length === 0) {
      btnLoadMoreRef.classList.add('is-hidden');
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    return;

  };
  
  //   if (hits.length > 40) {
  //   btnLoadMoreRef.classList.remove('.is-hidden');
  // } else {
  //   btnLoadMoreRef.classList.add('.is-hidden');
  // };

  if (data.totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    galleryRef.innerHTML = '';
  };
  renderCards(data.hits);
  btnLoadMoreRef.classList.remove('is-hidden');
  lightbox.refresh();
  endCollectionText.classList.add('is-hidden');
  

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
  const data = await fetchImages(searchImg);
  renderCards(data.hits);
  lightbox.refresh();

  currentHits += data.hits.length;
  
    if (currentHits === data.totalHits) {
    btnLoadMoreRef.classList.add('is-hidden');
    endCollectionText.classList.remove('is-hidden');
  }
  skrollGallery()
}

function skrollGallery() {
          const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
}