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
import {AUTHORIZATION, END_POINT} from './consts.js';

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new ApiService(END_POINT, AUTHORIZATION), filmsModel);
const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.main');
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

//я удалила загрузку комментов из main, соответственно filmsModel.addObserver тоже. Оставила этот код что ниже в filmsModel.init().finally, надеюсь норм
filmsModel.init().finally(() => {
  const siteHeaderElement = document.querySelector('.header');
  const footer = document.querySelector('.footer');
  render(siteHeaderElement, new ProfileView(filmsModel.films), RenderPosition.BEFOREEND);
  render(footer, new FooterView(filmsModel.films), RenderPosition.BEFOREEND);
});
