import { View, icons } from './view.js';
class PreviewView extends View {
  #parentElement = '';

  _generateMarkup() {
    const currendId = window.location.hash.slice(1);
    return `<li class="preview">
    <a class="preview__link ${
      currendId == this._data.id ? 'preview__link--active' : ''
    }" href="#${this._data.id}">
      <figure class="preview__fig">
        <img src="${this._data.image}" alt="${this._data.title}" /> 
      </figure>
      <div class="preview___data">
        <h4 class="preview__title">${this._data.title}</h4>
      </div>
    </a>
  </li>`;
  }
}
export default new PreviewView();
