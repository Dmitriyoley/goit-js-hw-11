import fetchImg from "./fetch"
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const refs ={
  form: document.querySelector(".search-form"),
  input: document.querySelector("input"),
  onBtn: document.querySelector("button"),
  gallery: document.querySelector(".gallery"),
  loadBtn: document.querySelector(".load-more")
}


refs.loadBtn.classList.add('is-hidden');

let page = 1;

const markup = data => {
  const galleryElements = data.hits
    .map(
        img =>
`<div class="photo-card"><a href="${img.largeImageURL}">
  <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy"/></a>
  <div class="info">
    <h2 class="info-item">
      <p>Likes</p>${img.likes}
    </h2>
    <h2 class="info-item">
      <p>Views</p>${img.views}
    </h2>
    <h2 class="info-item">
      <p>Comments</p>${img.comments}
    </h2>
    <h2 class="info-item">
      <p>Downloads</p>${img.downloads}
    </h2>
  </div>
</div>`)
    .join('');
    refs.gallery.insertAdjacentHTML('beforeend', galleryElements);
    refs.loadBtn.classList.remove('is-hidden');

    lightbox.refresh();
}

async function onSubmit (evt) {
  evt.preventDefault();
  page = 1;
  refs.gallery.innerHTML = '';
  try {
    const data = await fetchImg(refs.input.value, page);
    console.log(data);
    if (!data.hits.length) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    } else if (refs.input.value === '') {
      Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    markup(data);
  } catch (error) {
    console.log(error);
  }
};



async function loadMore() {
  try {
    page += 1;
    const data = await fetchImg(refs.input.value, page);
    if (!data.hits.length) {
      refs.loadBtn.classList.add('is-hidden');
    }
    markup(data);
  } catch (error) {
    console.log(error);
  }
}

refs.onBtn.addEventListener("click", onSubmit);
refs.loadBtn.addEventListener("click", loadMore);

