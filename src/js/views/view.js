import icons from '../../img/icons.svg';
export class View {
  _clear() {
    this.parentElement.innerHTML = '';
  }
  /**
   * Update the recived object to the dom
   * @param {Object | Object[]} data The data to be update (e.g recipe)
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const domElement = document
      .createRange()
      .createContextualFragment(newMarkup);
    const newElements = Array.from(domElement.querySelectorAll('*'));
    const currentElements = Array.from(
      this.parentElement.querySelectorAll('*')
    );

    newElements.forEach((newElement, i) => {
      let currentElement = currentElements[i];
      // Update change text
      if (
        !newElement.isEqualNode(currentElement) &&
        currentElement.firstChild?.nodeValue?.trim()
      ) {
        currentElement.textContent = newElement.textContent;
      }

      // Update change attributes
      if (!newElement.isEqualNode(currentElement)) {
        Array.from(newElement.attributes).forEach(attribute => {
          currentElement.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }
  /**
   * Render the recived object to the dom
   * @param {Object | Object[]} data The data to be rendered (e.g recipe)
   * @param {boolean} [forceRender = false] Force the mothod to render the object even if it's empty
   * @param {boolean} [render = true] If false, create markup string and return it, instead of rendering to the DOM
   * @returns {undefined | string} A markup strinf return if render=false
   * @this {Object} View instance
   * @author Roy Zluf
   */
  render(data, forceRender = false, render = true) {
    if (
      !data ||
      (Array.isArray(data) && data.length === 0 && !forceRender) ||
      (Object.keys(data).length === 0 &&
        data.constructor === Object &&
        !forceRender)
    ) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;

    this._clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Render a spinner object on the parent element
   *  @author Roy Zluf
   */
  renderSpinner() {
    const spinnerHtml = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
    this._clear();
    this.parentElement.insertAdjacentHTML('afterbegin', spinnerHtml);
  }

  /**
   * Render an error message on the parent element
   * @param {String} [errorMessage = this._errorMessage]
   *  @author Roy Zluf
   */
  renderError(errorMessage = this._errorMessage) {
    const markup = `
    <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${errorMessage}</p>
        </div>`;
    this._clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Render a message on the parent element
   * @param {String} [message = this.message]
   *  @author Roy Zluf
   */
  renderMessage(message = this.message) {
    const markup = ` <div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>
      ${message}
    </p>
  </div>`;
    this._clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

export { icons };
