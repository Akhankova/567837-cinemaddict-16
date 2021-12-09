import AbstractView from './abstract-view.js';

const createFilmsListTopRatedExtraTemplate = () => (
  `<section class="films-list films-list--extra" id='top-rated'>
  <h2 class="films-list__title">Top rated</h2>
  <div class="films-list__container">
</div>
</section>`
);


export default class FilmsListTopRatedExtraView extends AbstractView {
  get template() {
    return createFilmsListTopRatedExtraTemplate();
  }
}
