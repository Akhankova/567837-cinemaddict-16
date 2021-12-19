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

const boardPresenter = new MovieListPresenter(siteMainElement);

render(siteHeaderElement, new ProfileView(films), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationView(filters), RenderPosition.BEFOREEND);
render(footer, new FooterView(films), RenderPosition.BEFOREEND);

boardPresenter.init(films);
