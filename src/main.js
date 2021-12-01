import { createProfileTemplate } from './view/profile-view.js';
import { renderTemplate, RenderPosition } from './render.js';
import { createNavigationTemplate } from './view/navigation-view';
import { createSortTemplate } from './view/sort-view';
import { createBoardFilmsTemplate } from './view/board-films-views';
import { createFilmsListTemplate } from './view/films-list-views';
import { createFilmsContainerTemplate } from './view/films-container-views';
import { createButtonShowMoreTemplate } from './view/show-more-button-views';
import { createFilmsListTopRatedExtraTemplate } from './view/films-list-extra-views-top-rated';
import { createFilmsListExtraMostCommentedTemplate } from './view/films-list-extra-most-commented';
import { createFilmInformationTemplate } from './view/film-information';
import { createFooterTemplate } from './view/footer-views';
import { createCardFilmTemplate } from './view/card-film-views';

const CARD_COUNT = 5;
const CARD_COUNT_COMMENTED = 2;
const CARD_COUNT_RATING = 2;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footer = document.querySelector('.footer');

renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createNavigationTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createBoardFilmsTemplate(), RenderPosition.BEFOREEND);

const siteFilms = document.querySelector('.films');

renderTemplate(siteFilms, createFilmsListTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteFilms, createFilmsContainerTemplate(), RenderPosition.BEFOREEND);

const filmsContainer = document.querySelector('.films-list__container');

for (let i = 0; i < CARD_COUNT; i++) {
  renderTemplate(filmsContainer, createCardFilmTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(siteFilms, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteFilms, createFilmsListTopRatedExtraTemplate(), RenderPosition.BEFOREEND);
const filmsContainerTopRated = document.querySelector('#top-rated');
const topRated = filmsContainerTopRated.querySelector('div');

for (let i = 0; i < CARD_COUNT_COMMENTED; i++) {
  renderTemplate(topRated, createCardFilmTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(siteFilms, createFilmsListExtraMostCommentedTemplate(), RenderPosition.BEFOREEND);
const filmsContainerMostCommented = document.querySelector('#most-commented');
const mostCommented = filmsContainerMostCommented.querySelector('div');

for (let i = 0; i < CARD_COUNT_RATING; i++) {
  renderTemplate(mostCommented, createCardFilmTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(footer, createFooterTemplate(), RenderPosition.BEFOREEND);

renderTemplate(document.body, createFilmInformationTemplate(), RenderPosition.BEFOREEND);

