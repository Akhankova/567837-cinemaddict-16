import BoardFilmsView from '../view/board-films-views';
import SortView from '../view/sort-view';
import FilmsListView from '../view/films-list-view';
import FilmsContainerView from '../view/films-container-views';
import NoCardsView from '../view/no-cards-view';
import { CARD_COUNT_PER_STEP } from '../consts';
import ButtonShowMoreView from '../view/show-more-button-views';
import FilmsListTopRatedExtraView from '../view/films-list-extra-views-top-rated';
import FilmsListExtraMostCommentedView from '../view/films-list-extra-most-commented';
import MoviePresenter from './movie-presenter';
import { RenderPosition, render, remove, updateItem } from '../render';


export default class MovieListPresenter {
  #boardContainer = null;

  #boardComponent = new BoardFilmsView();
  #filmsContainerComponent = new FilmsContainerView();
  #sortComponent = new SortView();
  #filmsListComponent = new FilmsListView();
  #noCardComponent = new NoCardsView();
  #filmsListTopRatedExtraView = new FilmsListTopRatedExtraView();
  #filmsListExtraMostCommentedView = new FilmsListExtraMostCommentedView();
  #loadMoreButtonComponent = new ButtonShowMoreView();

  #boardFilms = [];
  #renderedFilmCount = CARD_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #filmCardTopRatedPresenters = new Map();
  #filmCardMostCommentedPresenters = new Map();

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (boardFilms) => {
    this.#boardFilms = [...boardFilms];

    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);
    render(this.#filmsListComponent, this.#filmsContainerComponent, RenderPosition.BEFOREEND);

    this.#renderBoard();
  }

  #handleCardChange = (updatedFilm) => {
    /*this.#boardFilms = updateItem(this.#boardFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    this.#filmCardTopRatedPresenters.get(updatedFilm.id).init(updatedFilm);
    this.#filmCardMostCommentedPresenters.get(updatedFilm.id).init(updatedFilm);*/

    const filmCardPresenter = this.#filmPresenter.get(updatedFilm.id);
    const filmCardTopRatedPresenter = this.#filmCardTopRatedPresenters.get(updatedFilm.id);
    const filmCardMostCommentedPresenter = this.#filmCardMostCommentedPresenters.get(updatedFilm.id);

    this.#boardFilms = updateItem(this.#boardFilms, updatedFilm);

    if (filmCardPresenter !== undefined) {
      filmCardPresenter.init(updatedFilm);
    }
    if (filmCardTopRatedPresenter !== undefined) {
      filmCardTopRatedPresenter.init(updatedFilm);
    }
    if (filmCardMostCommentedPresenter !== undefined) {
      filmCardMostCommentedPresenter.init(updatedFilm);
    }
  }

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }

  #renderSort = () => {
    render(this.#boardComponent, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderFilm = (place, card) => {
    const moviePresenter = new MoviePresenter(place, this.#handleCardChange, this.#handleModeChange);
    moviePresenter.init(card);
    this.#filmPresenter.set(card.id, moviePresenter);
  }

  #renderFilmCardTopRated = (place, card) => {
    const moviePresenter = new MoviePresenter(place, this.#handleCardChange, this.#handleModeChange);
    moviePresenter.init(card);
    this.#filmCardTopRatedPresenters.set(card.id, moviePresenter);
  }

  #renderFilmCardMostCommented = (place, card) => {
    const moviePresenter = new MoviePresenter(place, this.#handleCardChange, this.#handleModeChange);
    moviePresenter.init(card);
    this.#filmCardMostCommentedPresenters.set(card.id, moviePresenter);
  }

  #renderFilms = (from, to) => {
    this.#boardFilms
      .slice(from, to)
      .forEach((boardFilm) => this.#renderFilm(this.#filmsContainerComponent, boardFilm));
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
    render(this.#boardComponent, this.#noCardComponent, RenderPosition.BEFOREEND);
  }

  #handleLoadMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + CARD_COUNT_PER_STEP);
    this.#renderedFilmCount += CARD_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#boardFilms.length) {
      remove(this.#loadMoreButtonComponent);
    }
  }

  #renderLoadMoreButton = () => {
    render(this.#boardComponent, this.#loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = CARD_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  }

  #renderFilmList = () => {
    this.#renderFilms(0, Math.min(this.#boardFilms.length, CARD_COUNT_PER_STEP));

    if (this.#boardFilms.length > CARD_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  }

  #renderExtraFilms = () => {
    if (this.#boardFilms.length > 1) {
      render(this.#boardComponent, this.#filmsListTopRatedExtraView, RenderPosition.BEFOREEND);
      const filmsContainerTopRated = document.querySelector('#top-rated');
      const topRated = filmsContainerTopRated.querySelector('div');
      const topRatedCards = this.#boardFilms.slice().sort((first, second) => second.totalRating - first.totalRating);
      this.#renderFilmsTopRated(topRated, topRatedCards);

      render(this.#boardComponent, this.#filmsListExtraMostCommentedView, RenderPosition.BEFOREEND);
      const filmsContainerMostCommented = document.querySelector('#most-commented');
      const mostCommented = filmsContainerMostCommented.querySelector('div');
      const cardMostCommented = this.#boardFilms.slice().sort((first, second) => second.comments - first.comments);
      this.#renderFilmsMostCommented(mostCommented, cardMostCommented);
    }
  }

  #renderBoard = () => {
    this.#renderSort();
    if (this.#boardFilms.length < 1) {
      this.#renderNoFilms();
      return;
    }

    this.#renderFilmList();
    //this.#renderExtraFilms();
  }
}
