import { View } from './view';

class SearchView extends View {
  #parentElement = document.querySelector('.search');
  #searchField = document.querySelector('.search__field');

  getSearchValue() {
    const searchValue = this.#searchField.value;
    this.#clearSearchField();
    return searchValue;
  }
  #clearSearchField() {
    this.#searchField.value = '';
  }
  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', event => {
      event.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
