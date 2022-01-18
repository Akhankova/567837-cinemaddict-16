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
import { AUTHORIZATION, END_POINT, UpdateType } from './consts.js';

const siteHeaderElement = document.querySelector('.header');
const footer = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new ApiService(END_POINT, AUTHORIZATION), filmsModel);
const filterModel = new FilterModel();

filmsModel.addObserver((type) => {
  if (type !== UpdateType.INIT) { return; }
  commentsModel.init();
  render(siteHeaderElement, new ProfileView(filmsModel.films), RenderPosition.BEFOREEND);
  render(footer, new FooterView(filmsModel.films), RenderPosition.BEFOREEND);
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
filmsModel.init();

