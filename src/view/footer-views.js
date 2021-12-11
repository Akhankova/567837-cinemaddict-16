import AbstractView from './abstract-view.js';

const createFooterTemplate = (films) => (
  `<section class="footer__statistics">
    <p>${films.length} movies inside</p>
  </section>
`
);

export default class FooterView extends AbstractView{
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFooterTemplate(this.#films);
  }
}

