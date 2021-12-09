import AbstractView from './abstract-view.js';

const createNoCardsTemplate = () => (
  `<h2 class="films-list__title">There are no movies in our database</h2>
      `);

export default class NoCardsView extends AbstractView{
  get template() {
    return createNoCardsTemplate();
  }
}

