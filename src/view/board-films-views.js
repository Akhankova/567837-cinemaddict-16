import { createElement } from '../render.js';

const createBoardFilmsTemplate = () => (
  `<section class="films">
  </section>`
);


export default class BoardFilmsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createBoardFilmsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
