import AbstractView from './abstract-view.js';

const createFilmsListExtraMostCommentedTemplate = () => (
  `<section class="films-list films-list--extra" id='most-commented'>
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container">
    </div>
  </section>`
);

export default class FilmsListExtraMostCommentedView extends AbstractView {
  get template() {
    return createFilmsListExtraMostCommentedTemplate();
  }
}
