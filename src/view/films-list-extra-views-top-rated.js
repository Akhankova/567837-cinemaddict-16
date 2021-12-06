import {createElement} from '../render.js';

const createFilmsListTopRatedExtraTemplate = () => (
  `<section class="films-list films-list--extra" id='top-rated'>
  <h2 class="films-list__title">Top rated</h2>
  <div class="films-list__container">
</div>
</section>`
);


export default class FilmsListTopRatedExtraView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsListTopRatedExtraTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
