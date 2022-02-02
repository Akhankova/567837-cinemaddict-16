import BoardFilmsView from '../view/board-films-view.js';
import SortView from '../view/sort-view';
import FilmsListView from '../view/films-list-view';
import FilmsContainerView from '../view/films-container-view.js';
import NoCardsView from '../view/no-cards-view';
import { CARD_COUNT_PER_STEP, SortType, UpdateType, UserAction, FilterType } from '../consts';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import MoviePresenter, { State as MoviePresenterViewState } from './movie-presenter';
import { RenderPosition, render, remove, getSortRateCard, getSortDateCard } from '../render';
import { filter } from '../utils.js';
import LoadingView from '../view/loading-view.js';
import ProfileView from '../view/profile-view.js';
import { MIN_FILM_COUNT } from '../consts';


export default class MovieListPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #noCardComponent = null;
  #profileViewComponent = null;
  #sortComponent = null;
  #loadMoreButtonComponent = null;
  #siteHeaderElement = null;

  #loadingComponent = new LoadingView();
  #boardComponent = new BoardFilmsView();
  #filmsContainerComponent = new FilmsContainerView();
  #filmsListComponent = new FilmsListView();

  #renderedFilmCount = CARD_COUNT_PER_STEP;
  #currentSortType = SortType.DEFAULT;
  #filmPresenter = new Map();
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(siteHeaderElement, boardContainer, filmsModel, filterModel, commentsModel) {
    this.#siteHeaderElement = siteHeaderElement;
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
  }

  get films() {
    const films = this.#filmsModel.films;
    if (this.#filterModel.filter === 'stats') { return filter[FilterType.ALL](films); }
    this.#filterType = this.#filterModel.filter;
    const filteredFilms = filter[this.#filterType](films);
    switch (this.#currentSortType) {
      case SortType.RATING_SORT:
        return filteredFilms.sort(getSortRateCard);
      case SortType.DATE_SORT:
        return filteredFilms.sort(getSortDateCard);
    }
    return filteredFilms;
  }

  init = async () => {
    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);
    render(this.#filmsListComponent, this.#filmsContainerComponent, RenderPosition.BEFOREEND);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  destroy = () => {
    this.#clearBoard({ resetRenderedTaskCount: true, resetSortType: true });

    remove(this.#filmsListComponent);
    remove(this.#boardComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleModelEvent);
  }

  #handleViewAction = async (actionType, updateType, update, id, newComment) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        await this.#filmsModel.updateFilm(updateType, update, id);
        break;
      case UserAction.UPDATE_FILM_WITH_COMMENTS:
        await this.#commentsModel.updateComments(updateType, update, id);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmPresenter.get(update.id).setViewState(MoviePresenterViewState.SAVING);
        try {
          await this.#commentsModel.addComment(updateType, update, id, newComment);
          this.#filmPresenter.get(update.id).setViewState(MoviePresenterViewState.SUCCESS);
        } catch (err) {
          this.#filmPresenter.get(update.id).setViewState(MoviePresenterViewState.ABORTING_NEW_COMMENT);
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmPresenter.get(update.id).setViewState(MoviePresenterViewState.DELETING);
        try {
          await this.#commentsModel.deleteComment(updateType, update, id, newComment);
        } catch (err) {
          this.#filmPresenter.get(update.id).setViewState(MoviePresenterViewState.ABORTING);
        }
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearBoard();
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

    const moviePresenter = new MoviePresenter(place, this.#handleViewAction, this.#handleModeChange, this.#commentsModel);
    const comments = [];
    this.#commentsModel.getComments(card.id).forEach((comment) => {
      comment.commentDelete = false;
      comments.push(comment);
    });
    moviePresenter.init(card, comments);
    this.#filmPresenter.set(card.id, moviePresenter);
  }

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(this.#filmsContainerComponent, film));
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

  #renderLoading = () => {
    render(this.#boardComponent, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new ButtonShowMoreView();

    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
    render(this.#boardComponent, this.#loadMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  #clearBoard = ({ resetRenderedCardCount = false, resetSortType = false } = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#loadingComponent);
    remove(this.#sortComponent);
    remove(this.#profileViewComponent);
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

  #renderProfile = () => {
    if (this.#profileViewComponent !== null) {
      this.#profileViewComponent = null;
    }
    this.#profileViewComponent = new ProfileView(this.#filmsModel.films);
    render(this.#siteHeaderElement, this.#profileViewComponent, RenderPosition.BEFOREEND);
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const films = this.films;
    const filmCount = films.length;
    this.#renderProfile();
    this.#renderSort();
    if (filmCount === MIN_FILM_COUNT) {
      this.#renderNoFilms();
      return;
    }
    this.#renderFilms(films.slice(MIN_FILM_COUNT, Math.min(filmCount, this.#renderedFilmCount)));

    if (filmCount > this.#renderedFilmCount) {
      this.#renderLoadMoreButton();
    }
  }
}
