import ProfileView from './view/profile-view.js';
import { RenderPosition, render } from './render.js';
import NavigationView from './view/navigation-view';
import SortView from './view/sort-view';
import BoardFilmsView from './view/board-films-views';
import FilmsListView from './view/films-list-view';
import FilmsContainerView from './view/films-container-views';
import ButtonShowMoreView from './view/show-more-button-views';
import FilmsListTopRatedExtraView from './view/films-list-extra-views-top-rated';
import FilmsListExtraMostCommentedView from './view/films-list-extra-most-commented';
import FilmInfotmationView from './view/film-information';
import FooterView from './view/footer-views';
import NoCardsView from './view/no-cards-view';
import CardFilmView from './view/card-film-views';
import { getCreateFilmCard, generateFilter } from './mock/card.js';
import { CARD_COUNT, CARD_COUNT_COMMENTED, CARD_COUNT_RATING, CARD_COUNT_PER_STEP } from './consts';

const films = Array.from({ length: CARD_COUNT }, getCreateFilmCard);
const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footer = document.querySelector('.footer');
const bodyElement = document.querySelector('body');

let filmEditComponent;
const renderFilmInfo = (cardListElement, card) => {
  const filmComponent = new CardFilmView(card);

  const onReplaceFormCardInfoClick = () => {
    bodyElement.classList.remove('hide-overflow');
    document.body.removeChild(filmEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      bodyElement.classList.remove('hide-overflow');
      onReplaceFormCardInfoClick();
      document.removeEventListener('keydown', this._onEscKeyDown);
    }
  };

  const onGetFormCardInfoClick = () => {
    if (document.body.querySelector('.film-details')) {
      document.body.querySelector('.film-details').remove();
    }
    filmEditComponent = new FilmInfotmationView(card).element;
    bodyElement.classList.add('hide-overflow');
    document.body.appendChild(filmEditComponent, RenderPosition.BEFOREEND);
    filmEditComponent.querySelector('.film-details__close-btn').addEventListener('click', onReplaceFormCardInfoClick);
    document.addEventListener('keydown', onEscKeyDown);
  };

  const filmLink = filmComponent.element.querySelector('.film-card__link');
  filmLink.addEventListener('click', onGetFormCardInfoClick);
  render(cardListElement, filmComponent.element, RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new ProfileView(films).element, RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationView(filters).element, RenderPosition.BEFOREEND);
render(siteMainElement, new SortView().element, RenderPosition.BEFOREEND);

const boardComponent = new BoardFilmsView().element;
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

const filmListComponent = new FilmsListView().element;
render(boardComponent, filmListComponent, RenderPosition.BEFOREEND);

if (films.length < 1) {
  render(filmListComponent, new NoCardsView().element, RenderPosition.BEFOREEND);
}

const filmsContainerComponent = new FilmsContainerView().element;
render(filmListComponent, filmsContainerComponent, RenderPosition.BEFOREEND);

for (let i = 0; i < Math.min(films.length, CARD_COUNT_PER_STEP); i++) {
  renderFilmInfo(filmsContainerComponent, films[i]);
}

if (films.length > CARD_COUNT_PER_STEP) {
  let renderedTaskCount = CARD_COUNT_PER_STEP;
  const loadMoreButtonComponent = new ButtonShowMoreView();

  render(boardComponent, loadMoreButtonComponent.element, RenderPosition.BEFOREEND);

  loadMoreButtonComponent.element.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedTaskCount, renderedTaskCount + CARD_COUNT_PER_STEP)
      .forEach((film) => renderFilmInfo(filmsContainerComponent, film));

    renderedTaskCount += CARD_COUNT_PER_STEP;

    if (renderedTaskCount >= films.length) {
      loadMoreButtonComponent.element.remove();
      loadMoreButtonComponent.removeElement();
    }
  });
}

if (films.length > 1) {
  render(boardComponent, new FilmsListTopRatedExtraView().element, RenderPosition.BEFOREEND);
  const filmsContainerTopRated = document.querySelector('#top-rated');
  const topRated = filmsContainerTopRated.querySelector('div');

  for (let i = 0; i < CARD_COUNT_COMMENTED; i++) {
    renderFilmInfo(topRated, films[i]);
  }

  render(boardComponent, new FilmsListExtraMostCommentedView().element, RenderPosition.BEFOREEND);
  const filmsContainerMostCommented = document.querySelector('#most-commented');
  const mostCommented = filmsContainerMostCommented.querySelector('div');

  for (let i = 0; i < CARD_COUNT_RATING; i++) {
    renderFilmInfo(mostCommented, films[i]);
  }
}


render(footer, new FooterView(films).element, RenderPosition.BEFOREEND);


