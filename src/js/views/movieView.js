import { View, icons } from './view.js';
class MovieView extends View {
  #parentElement = document.querySelector('.movie');
  _data;
  _errorMessage = `Oops! Something went wrong with loading the movie. Try again later.`;
  #message = '';
  _buttonsElement = document.querySelector('.recipe__info-buttons');
  get parentElement() {
    return this.#parentElement;
  }
  get errorMessage() {
    return this._errorMessage;
  }
  get message() {
    return this.#message;
  }

  _generateMarkup() {
    return Object.keys(this._data).length === 0 &&
      this._data.constructor === Object
      ? ''
      : `<h1 class="movie__title">
      <span>${this._data.title}</span>
    </h1>
    <figure class="movie__fig">
      <img src="${this._data.image}" alt="${
          this._data.title
        }" class="movie__img" />
    </figure>
    <div class="movie__details">
    <div class="movie__info">
      <svg class="movie__info-icon">
        <use href="${icons}#icon-calendar"></use>
      </svg>
      <span class="movie__info-data movie__info-data--length"
        >Release Date:</span
      >
      <span class="movie__info-text">${this._data.releaseDate}</span>
    </div>
    <div class="movie__info">
      <svg class="movie__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="movie__info-data movie__info-data--minutes"
        >Length:</span
      >
      <span class="movie__info-text">${this._data.length} minutes</span>
    </div>

    <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}#icon-bookmark${
          this._data?.bookmarked ? '-fill' : ''
        }"></use>
      </svg>
    </button>
   
  </div>
  ${this.#generateGenres()}
  
  <div class="movie__Overview">
  <h2 class="heading--2">Overview</h2>
  <p class="movie__Overview-text">
  ${this._data.overview}
    
  </p>
  <a
    class="btn--small movie__btn"
    href="${this._data.trailer}"
    target="_blank"
  >
    <span>Watch Trailer</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </a>
</div>`;
  }
  #generateGenres() {
    return this._data?.genres == null
      ? ''
      : `
  <div class="movie__genres">
  <h1 class="heading--3">${this._data.genres.join(' | ')}</h1>
  </div>`;
  }
  addHandlerRender(...handlers) {
    // showRecipe events listeners
    ['hashchange', 'load'].forEach(showRecipeEvent =>
      handlers.forEach(handler =>
        window.addEventListener(showRecipeEvent, handler)
      )
    );
  }

  addHandlerBookmark(handler) {
    this.parentElement.addEventListener('click', event => {
      const button = event.target.closest('.btn--bookmark');
      if (!button) return;

      handler();
    });
  }
}

export default new MovieView();
