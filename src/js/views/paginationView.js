import { View, icons } from './view.js';
class PaginationView extends View {
  #parentElement = document.querySelector('.pagination');
  _data;
  get parentElement() {
    return this.#parentElement;
  }

  _generateMarkup() {
    return `${
      this._data?.prev
        ? `<button data-page-number = "${this._data.prev}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this._data.prev}</span>
    </button>`
        : ''
    }
    ${
      this._data?.next
        ? `<button data-page-number = "${this._data.next}" class="btn--inline pagination__btn--next">
    <span>Page ${this._data.next}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`
        : ''
    }
    `;
  }
  addHandlerPagination(handler) {
    this.#parentElement.addEventListener('click', event => {
      const clickedButtonelement = event.target.closest('.btn--inline');
      if (!clickedButtonelement) return;
      const pageNumber = parseInt(
        event.target.closest('.btn--inline')?.dataset?.pageNumber
      );
      handler(pageNumber);
    });
  }
}
export default new PaginationView();
