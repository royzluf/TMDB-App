import { View } from './view.js';
import previewView from './previewView.js';
class ResultsView extends View {
  #parentElement = document.querySelector('.results');
  _data;
  _errorMessage = `No movies found for your query! Please try again.`;
  get parentElement() {
    return this.#parentElement;
  }

  _generateMarkup() {
    return this._data
      .map(recipe => previewView.render(recipe, false, false))
      .join('');
  }
}
export default new ResultsView();
