import FilmInfotmationView from '../view/film-information';
import { render, RenderPosition, remove, replace } from '../render';
import CardFilmView from '../view/card-film-views';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const bodyElement = document.querySelector('body');

export default class MoviePresenter {
  #filmListContainer = null;
  #changeData = null;
  #changeMode = null;

  #filmComponent = null;
  #filmEditComponent = null;

  #film = null;
  #mode = Mode.DEFAULT

  constructor(filmListContainer, changeData, changeMode) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevFilmEditComponent = this.#filmEditComponent;

    this.#filmComponent = new CardFilmView(film);
    this.#filmEditComponent = new FilmInfotmationView(film);

    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

    this.#filmEditComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmEditComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmEditComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

    this.#filmComponent.setCardClickHandler(this.#handleCardClick);
    this.#filmEditComponent.setEditClickHandler(this.#handleEditClick);

    if (prevFilmComponent === null || prevFilmEditComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmListContainer.element.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (bodyElement.contains(prevFilmEditComponent.element)) {
      replace(this.#filmEditComponent, prevFilmEditComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmEditComponent);

  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmEditComponent);
  }

  #onReplaceFormCardInfoClick = () => {
    bodyElement.classList.remove('hide-overflow');
    remove(this.#filmEditComponent);
    this.#mode = Mode.DEFAULT;
    this.#filmEditComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmEditComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmEditComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmEditComponent.setEditClickHandler(this.#handleEditClick);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      bodyElement.classList.remove('hide-overflow');
      this.#onReplaceFormCardInfoClick();
      document.removeEventListener('keydown', this.#onEscKeyDown);
      this.#filmEditComponent.setEditClickHandler(this.#handleEditClick);
      this.#mode = Mode.DEFAULT;
    }
  };

  #onGetFormCardInfoClick = () => {
    if (bodyElement.querySelector('.film-details')) {
      bodyElement.querySelector('.film-details').remove();
    }
    bodyElement.classList.add('hide-overflow');
    bodyElement.appendChild(this.#filmEditComponent.element, RenderPosition.BEFOREEND);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#onReplaceFormCardInfoClick();
    }
  }

  #handleCardClick = () => {
    this.#onGetFormCardInfoClick();
  }

  #handleEditClick = () => {
    this.#onReplaceFormCardInfoClick();
  }

  #handleFavoriteClick = () => {
    this.#changeData({ ...this.#film, isFavorites: !this.#film.isFavorites });
  }

  #handleHistoryClick = () => {
    this.#changeData({ ...this.#film, isWatched: !this.#film.isWatched });
  }

  #handleWatchlistClick = () => {
    this.#changeData({ ...this.#film, isWatchlist: !this.#film.isWatchlist });
  }

}
