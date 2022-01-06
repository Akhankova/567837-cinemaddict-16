import FilmInfotmationView from '../view/film-information';
import { render, RenderPosition, remove, replace } from '../render';
import CardFilmView from '../view/card-film-views';
import { UserAction, UpdateType } from '../consts';

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
  #comments = null;
  #emotion = ' ';
  #newCommentText = '';
  #mode = Mode.DEFAULT;
  #scroll = null;

  constructor(filmListContainer, changeData, changeMode) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film, comments) => {
    this.#film = film;
    this.#comments = comments;
    const prevFilmComponent = this.#filmComponent;
    const prevFilmEditComponent = this.#filmEditComponent;
    this.#filmComponent = new CardFilmView(film, comments);
    this.#filmEditComponent = new FilmInfotmationView(film, comments, this.#emotion, this.#newCommentText, this.#scroll);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

    this.#filmEditComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmEditComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmEditComponent.setWatchlistClickHandler(this.#handleWatchlistClick);

    this.#filmComponent.setCardClickHandler(this.#handleCardClick);
    this.#filmEditComponent.setEditClickHandler(this.#handleEditClick);
    this.#filmEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
    this.#filmEditComponent.setAddClickHandler(this.#handleAddClick);
    this.#filmEditComponent.setCommentsEmotionHandler(this.#handleGetCommentsEmotion);
    this.#filmEditComponent.setCommentNewTextHandler(this.#handleGetCommentText);

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
    this.#mode = Mode.DEFAULT;
    this.#filmEditComponent.reset(this.#film, this.#comments);
    this.#filmEditComponent.element.remove();
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#mode = Mode.DEFAULT;
      this.#filmEditComponent.reset(this.#film, this.#comments);
      this.#filmEditComponent.element.remove();
      document.removeEventListener('keydown', this.#onEscKeyDown);
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
    this.#filmEditComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmEditComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmEditComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmEditComponent.setEditClickHandler(this.#handleEditClick);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#filmEditComponent.reset(this.#film, this.#comments);
      this.#onReplaceFormCardInfoClick();
    }
  }

  #handleCardClick = () => {
    this.#onGetFormCardInfoClick();
  }

  #handleEditClick = () => {
    this.#emotion = ' ';
    this.#newCommentText = '';
    this.#onReplaceFormCardInfoClick();
  }

  #handleFavoriteClick = (comments, scroll) => {
    this.#scroll = scroll;
    this.#comments = comments;
    this.#changeData(
      bodyElement.querySelector('.film-details') ? UserAction.UPDATE_FILM_WITH_COMMENTS : UserAction.UPDATE_FILM,
      bodyElement.querySelector('.film-details') ? UpdateType.PATCH : UpdateType.MINOR,
      { ...this.#film, isFavorites: !this.#film.isFavorites }, this.#comments);
  }

  #handleHistoryClick = (comments, scroll) => {
    this.#scroll = scroll;
    this.#comments = comments;
    this.#changeData(
      bodyElement.querySelector('.film-details') ? UserAction.UPDATE_FILM_WITH_COMMENTS : UserAction.UPDATE_FILM,
      bodyElement.querySelector('.film-details') ? UpdateType.PATCH : UpdateType.MINOR,
      { ...this.#film, isWatched: !this.#film.isWatched }, this.#comments);
  }

  #handleWatchlistClick = (comments, scroll) => {
    this.#scroll = scroll;
    this.#comments = comments;
    this.#changeData(
      bodyElement.querySelector('.film-details') ? UserAction.UPDATE_FILM_WITH_COMMENTS : UserAction.UPDATE_FILM,
      bodyElement.querySelector('.film-details') ? UpdateType.PATCH : UpdateType.MINOR,
      { ...this.#film, isWatchlist: !this.#film.isWatchlist }, this.#comments);
  }

  #handleDeleteClick = (film, id, comments, scroll) => {
    this.#scroll = scroll;
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      film,
      id,
      comments,
    );
  }

  #handleAddClick = (film, comment, comments, emotionNew, commentTextNew, scroll) => {
    this.#scroll = scroll;
    this.#emotion = emotionNew;
    this.#newCommentText = commentTextNew;
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      film,
      comment,
      comments
    );
  }

  #handleGetCommentsEmotion = (emotion) => {
    this.#emotion = emotion;
  };

  #handleGetCommentText = (text) => {
    this.#newCommentText = text;
  }
}
