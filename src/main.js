import ProfileView from './view/profile-view.js';
import { RenderPosition, render, remove } from './render.js';
import FooterView from './view/footer-views';
import { getCreateFilmCard, getCommentText } from './mock/card.js';
import { CARD_COUNT } from './consts.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import CommentsModel from './model/comments-model.js';
import StatisticsView from './view/statistics-view.js';

const films = Array.from({ length: CARD_COUNT }, getCreateFilmCard);
const filmsModel = new FilmsModel();
filmsModel.films = films;

const comments = films.reduce((filmComments, film) => {
  const comment = {
    id: film.id,
    comments: film.commentsId.map((id) => getCommentText(id)),
  };

  filmComments.push(comment);
  return filmComments;
}, []);

const commentsModel = new CommentsModel();
commentsModel.setcomments(comments);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footer = document.querySelector('.footer');

render(siteHeaderElement, new ProfileView(films), RenderPosition.BEFOREEND);
render(footer, new FooterView(films), RenderPosition.BEFOREEND);

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
