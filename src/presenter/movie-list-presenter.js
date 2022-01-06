import BoardFilmsView from '../view/board-films-views';
import SortView from '../view/sort-view';
import FilmsListView from '../view/films-list-view';
import FilmsContainerView from '../view/films-container-views';
import NoCardsView from '../view/no-cards-view';
import { CARD_COUNT_PER_STEP, SortType, UpdateType, UserAction, FilterType } from '../consts';
import ButtonShowMoreView from '../view/show-more-button-views';
import FilmsListTopRatedExtraView from '../view/films-list-extra-views-top-rated';
import FilmsListExtraMostCommentedView from '../view/films-list-extra-most-commented';
import MoviePresenter from './movie-presenter';
import { RenderPosition, render, remove, getSortRateCard, getSortDateCard } from '../render';
import { filter } from '../utils.js';


export default class MovieListPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #noCardComponent = null;

  #boardComponent = new BoardFilmsView();
  #filmsContainerComponent = new FilmsContainerView();
  #filmsListComponent = new FilmsListView();

  #filmsListTopRatedExtraView = new FilmsListTopRatedExtraView();
  #filmsListExtraMostCommentedView = new FilmsListExtraMostCommentedView();
  #sortComponent = null;
  #loadMoreButtonComponent = null;

  #renderedFilmCount = CARD_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filmPresenter = new Map();
  #filmCardTopRatedPresenters = new Map();
  #filmCardMostCommentedPresenters = new Map();
  #filterType = FilterType.ALL;

  constructor(boardContainer, filmsModel, filterModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);
    switch (this.#currentSortType) {
      case SortType.RATING_SORT:
        return filteredFilms.sort(getSortRateCard);
      case SortType.DATE_SORT:
        return filteredFilms.sort(getSortDateCard);
    }
    return filteredFilms;
  }

  init = () => {
    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);
    render(this.#filmsListComponent, this.#filmsContainerComponent, RenderPosition.BEFOREEND);

    this.#renderBoard();
  }

  #handleViewAction = (actionType, updateType, update, id, newComment) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update, id);
        break;
      case UserAction.UPDATE_FILM_WITH_COMMENTS:
        this.#commentsModel.updateComments(updateType, update, id);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update, id, newComment);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update, id, newComment);
        break;
    }
  }

  #handleModelEvent = (updateType, data, comments) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data, comments);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetRenderedCardCount: true, resetSortType: true });
        this.#renderBoard();
        break;
    }
  }

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard({ resetRenderedCardCount: true });
    this.#renderBoard();
  }

  #renderSort = () => {
    if (this.#sortComponent !== null) {
      this.#sortComponent = null;
    }
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#boardComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderFilm = (place, card) => {
    const moviePresenter = new MoviePresenter(place, this.#handleViewAction, this.#handleModeChange);
    moviePresenter.init(card, this.#commentsModel.getcomments(card.id));
    this.#filmPresenter.set(card.id, moviePresenter);
  }

  #renderFilmCardTopRated = (place, card) => {
    const moviePresenter = new MoviePresenter(place, this.#handleViewAction, this.#handleModeChange);
    moviePresenter.init(card);
    this.#filmCardTopRatedPresenters.set(card.id, moviePresenter);
  }

  #renderFilmCardMostCommented = (place, card) => {
    const moviePresenter = new MoviePresenter(place, this.#handleViewAction, this.#handleModeChange);
    moviePresenter.init(card);
    this.#filmCardMostCommentedPresenters.set(card.id, moviePresenter);
  }

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(this.#filmsContainerComponent, film, this.#commentsModel.getcomments(film.id)));
  }

  #renderFilmsTopRated = (place, cards) => {
    cards
      .slice(0, 2)
      .forEach((boardFilm) => this.#renderFilmCardTopRated(place, boardFilm));
  }

  #renderFilmsMostCommented = (place, cards) => {
    cards
      .slice(0, 2)
      .forEach((boardFilm) => this.#renderFilmCardMostCommented(place, boardFilm));
  }

  #renderNoFilms = () => {
    this.#noCardComponent = new NoCardsView(this.#filterType);
    render(this.#boardComponent, this.#noCardComponent, RenderPosition.BEFOREEND);
  }

  #handleLoadMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedCardCount = Math.min(filmCount, this.#renderedFilmCount + CARD_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedCardCount);
    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedCardCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new ButtonShowMoreView();

    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
    render(this.#boardComponent, this.#loadMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  #renderExtraFilms = () => {
    if (this.films.length > 1) {
      render(this.#boardComponent, this.#filmsListTopRatedExtraView, RenderPosition.BEFOREEND);
      const filmsContainerTopRated = document.querySelector('#top-rated');
      const topRated = filmsContainerTopRated.querySelector('div');
      const topRatedCards = this.films.slice().sort((first, second) => second.totalRating - first.totalRating);
      this.#renderFilmsTopRated(topRated, topRatedCards);

      render(this.#boardComponent, this.#filmsListExtraMostCommentedView, RenderPosition.BEFOREEND);
      const filmsContainerMostCommented = document.querySelector('#most-commented');
      const mostCommented = filmsContainerMostCommented.querySelector('div');
      const cardMostCommented = this.films.slice().sort((first, second) => second.comments - first.comments);
      this.#renderFilmsMostCommented(mostCommented, cardMostCommented);
    }
  }

  #clearBoard = ({ resetRenderedCardCount = false, resetSortType = false } = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadMoreButtonComponent);

    if (this.#noCardComponent) {
      remove(this.#noCardComponent);
    }

    if (resetRenderedCardCount) {
      this.#renderedFilmCount = CARD_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard = () => {
    const films = this.films;
    const filmCount = films.length;

    this.#renderSort();
    if (filmCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));

    if (filmCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
    //this.#renderExtraFilms();
  }
}
