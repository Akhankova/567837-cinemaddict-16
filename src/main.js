import ProfileView from './view/profile-view.js';
import { RenderPosition, render, remove } from './render.js';
import FooterView from './view/footer-views';
import { getCommentText } from './mock/card.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import CommentsModel from './model/comments-model.js';
import StatisticsView from './view/statistics-view.js';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic hS2ssS66wcm1sa9j';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
// eslint-disable-next-line no-console
console.log(filmsModel.films);

const comments = filmsModel.films.reduce((filmComments, film) => {
  const comment = {
    id: film.id,
    comments: film.commentsId.map((id) => getCommentText(id)),
  };
  filmComments.push(comment);
  return filmComments;
}, []);

const commentsModel = new CommentsModel(new ApiService(END_POINT, AUTHORIZATION));
commentsModel.setcomments(comments);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footer = document.querySelector('.footer');

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
