import { View } from './view.js';
import PreviewView from './previewView.js';
class BookmarkView extends View {
  #parentElement = document.querySelector('.bookmarks__list');
  _data;
  _errorMessage = 'No bookmarks yet.';
  get parentElement() {
    return this.#parentElement;
  }
  _generateMarkup() {
    return `${this._data
      .map(recipe => PreviewView.render(recipe, false, false))
      .join('')}`;
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarkView();
