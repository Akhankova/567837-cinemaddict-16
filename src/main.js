import ProfileView from './view/profile-view.js';
import { RenderPosition, render } from './render.js';
import NavigationView from './view/navigation-view';
import FooterView from './view/footer-views';
import { getCreateFilmCard, generateFilter } from './mock/card.js';
import { CARD_COUNT } from './consts';
import MovieListPresenter from './presenter/movie-list-presenter';

const films = Array.from({ length: CARD_COUNT }, getCreateFilmCard);
const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footer = document.querySelector('.footer');
//const bodyElement = document.querySelector('body');

const boardPresenter = new MovieListPresenter(siteMainElement);

/*const renderFilmInfo = (cardListElement, card) => {
  const filmComponent = new CardFilmView(card);
  const filmEditComponent = new FilmInfotmationView(card);

  const onReplaceFormCardInfoClick = () => {
    bodyElement.classList.remove('hide-overflow');
    remove(filmEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      bodyElement.classList.remove('hide-overflow');
      onReplaceFormCardInfoClick();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const onGetFormCardInfoClick = () => {
    if (bodyElement.querySelector('.film-details')) {
      bodyElement.querySelector('.film-details').remove();
    }
    bodyElement.classList.add('hide-overflow');
    bodyElement.appendChild(filmEditComponent.element, RenderPosition.BEFOREEND);
    filmEditComponent.setEditClickHandler(() => {
      onReplaceFormCardInfoClick();
    });
    document.addEventListener('keydown', onEscKeyDown);
  };

  filmComponent.setCardClickHandler(() => {
    onGetFormCardInfoClick();
  });
  render(cardListElement, filmComponent, RenderPosition.BEFOREEND);
};*/

render(siteHeaderElement, new ProfileView(films), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationView(filters), RenderPosition.BEFOREEND);

/*const boardComponent = new BoardFilmsView();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

const filmListComponent = new FilmsListView();
render(boardComponent, filmListComponent, RenderPosition.BEFOREEND);

if (films.length < 1) {
  render(filmListComponent, new NoCardsView(), RenderPosition.BEFOREEND);
}

const filmsContainerComponent = new FilmsContainerView();
render(filmListComponent, filmsContainerComponent, RenderPosition.BEFOREEND);

for (let i = 0; i < Math.min(films.length, CARD_COUNT_PER_STEP); i++) {
  renderFilmInfo(filmsContainerComponent, films[i]);
}

if (films.length > CARD_COUNT_PER_STEP) {
  let renderedTaskCount = CARD_COUNT_PER_STEP;
  const loadMoreButtonComponent = new ButtonShowMoreView();

  render(boardComponent, loadMoreButtonComponent, RenderPosition.BEFOREEND);

  loadMoreButtonComponent.setClickHandler(() => {
    films
      .slice(renderedTaskCount, renderedTaskCount + CARD_COUNT_PER_STEP)
      .forEach((film) => renderFilmInfo(filmsContainerComponent, film));

    renderedTaskCount += CARD_COUNT_PER_STEP;

    if (renderedTaskCount >= films.length) {
      remove(loadMoreButtonComponent);
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
}*/


render(footer, new FooterView(films), RenderPosition.BEFOREEND);

boardPresenter.init(films);
