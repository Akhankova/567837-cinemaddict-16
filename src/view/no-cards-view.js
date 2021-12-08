import { createElement } from '../render.js';

const createNoCardsTemplate = () => (
  `<h2 class="films-list__title">There are no movies in our database</h2>
      `);

export default class NoCardsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNoCardsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

