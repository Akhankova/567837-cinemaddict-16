import AbstractView from './abstract-view.js';

const createBoardFilmsTemplate = () => (
  `<section class="films">
  </section>`
);

export default class BoardFilmsView extends AbstractView {
  get template() {
    return createBoardFilmsTemplate();
  }
}
