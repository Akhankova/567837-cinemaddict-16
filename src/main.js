import { createProfileTemplate } from './view/profile-view.js';
import { renderTemplate, RenderPosition } from './render.js';
import { createNavigationTemplate } from './view/navigation-view';
import { createSortTemplate } from './view/sort-view';
import { createBoardFilmsTemplate } from './view/board-films-views';
import { createFilmsListTemplate } from './view/films-list-view';
import { createFilmsContainerTemplate } from './view/films-container-views';
import { createButtonShowMoreTemplate } from './view/show-more-button-views';
import { createFilmsListTopRatedExtraTemplate } from './view/films-list-extra-views-top-rated';
import { createFilmsListExtraMostCommentedTemplate } from './view/films-list-extra-most-commented';
//import { createFilmInformationTemplate } from './view/film-information';
import { createFooterTemplate } from './view/footer-views';
import { createCardFilmTemplate } from './view/card-film-views';
import { getCreateFilmCard, generateFilter } from './mock/card.js';
import { CARD_COUNT, CARD_COUNT_COMMENTED, CARD_COUNT_RATING, CARD_COUNT_PER_STEP } from './consts';

const films = Array.from({length: CARD_COUNT}, getCreateFilmCard);
const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footer = document.querySelector('.footer');

renderTemplate(siteHeaderElement, createProfileTemplate(films), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createNavigationTemplate(filters), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createBoardFilmsTemplate(), RenderPosition.BEFOREEND);

const siteFilms = document.querySelector('.films');

renderTemplate(siteFilms, createFilmsListTemplate(), RenderPosition.BEFOREEND);
const filmsList = document.querySelector('.films-list');

renderTemplate(filmsList, createFilmsContainerTemplate(), RenderPosition.BEFOREEND);

const filmsContainer = document.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, CARD_COUNT_PER_STEP); i++) {
  renderTemplate(filmsContainer, createCardFilmTemplate(films[i]), RenderPosition.BEFOREEND);
}

if (films.length > CARD_COUNT_PER_STEP) {
  let renderedTaskCount = CARD_COUNT_PER_STEP;
  renderTemplate(siteFilms, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);

  const loadMoreButton = siteMainElement.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedTaskCount, renderedTaskCount + CARD_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(filmsContainer, createCardFilmTemplate(film), RenderPosition.BEFOREEND));

    renderedTaskCount += CARD_COUNT_PER_STEP;

    if (renderedTaskCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}


renderTemplate(siteFilms, createFilmsListTopRatedExtraTemplate(), RenderPosition.BEFOREEND);
const filmsContainerTopRated = document.querySelector('#top-rated');
const topRated = filmsContainerTopRated.querySelector('div');

for (let i = 0; i < CARD_COUNT_COMMENTED; i++) {
  renderTemplate(topRated, createCardFilmTemplate(films[i]), RenderPosition.BEFOREEND);
}

renderTemplate(siteFilms, createFilmsListExtraMostCommentedTemplate(), RenderPosition.BEFOREEND);
const filmsContainerMostCommented = document.querySelector('#most-commented');
const mostCommented = filmsContainerMostCommented.querySelector('div');

for (let i = 0; i < CARD_COUNT_RATING; i++) {
  renderTemplate(mostCommented, createCardFilmTemplate(films[i]), RenderPosition.BEFOREEND);
}

renderTemplate(footer, createFooterTemplate(films), RenderPosition.BEFOREEND);

//renderTemplate(document.body, createFilmInformationTemplate(films[0]), RenderPosition.BEFOREEND);

