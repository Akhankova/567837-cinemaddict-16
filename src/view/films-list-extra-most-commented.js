import {createElement} from '../render.js';

const createFilmsListExtraMostCommentedTemplate = () => (
  `<section class="films-list films-list--extra" id='most-commented'>
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container">
    </div>
  </section>`
);

export default class FilmsListExtraMostCommentedView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsListExtraMostCommentedTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
