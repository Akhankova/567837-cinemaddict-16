import AbstractView from './abstract-view.js';

const createFilmsContainerTemplate = () => (
  `<div class="films-list__container"></div>
  `
);

export default class FilmsContainerView extends AbstractView{
  get template() {
    return createFilmsContainerTemplate();
  }
}
