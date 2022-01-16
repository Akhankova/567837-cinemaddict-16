import ProfileView from './view/profile-view.js';
import { RenderPosition, render, remove } from './render.js';
import FooterView from './view/footer-views';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import CommentsModel from './model/comments-model.js';
import StatisticsView from './view/statistics-view.js';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic hS2ssS66wcm1sa9j';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';
const api = new ApiService(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footer = document.querySelector('.footer');

filmsModel.addObserver(() => {
  const comments = filmsModel.films.map((film) => api.getComments(film.id));
  Promise.all(comments).then((result) => { commentsModel.setcomments(result); });
});

const boardPresenter = new MovieListPresenter(siteMainElement, filmsModel, filterModel, commentsModel);
let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  if (menuItem !== 'stats') {
    remove(statisticsComponent);
    boardPresenter.destroy();
    boardPresenter.init();
  }
  if (menuItem === 'stats') {
    boardPresenter.destroy();
    statisticsComponent = new StatisticsView(filmsModel.films);
    render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
  }
};

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel, handleSiteMenuClick);

filterPresenter.init();
boardPresenter.init();

filmsModel.init().finally(() => {
  render(siteHeaderElement, new ProfileView(filmsModel.films), RenderPosition.BEFOREEND);
  render(footer, new FooterView(filmsModel.films), RenderPosition.BEFOREEND);
});
