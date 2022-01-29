import FilmInformationView from '../view/film-information';
import { render, RenderPosition, remove, replace } from '../render';
import CardFilmView from '../view/card-film-views';
import { UserAction, UpdateType } from '../consts';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
  ABORTING_NEW_COMMENT: 'ABORTING_NEW_COMMENT',
  SAVING: 'SAVING',
  SUCCESS: 'SUCCESS',
};

const bodyElement = document.querySelector('body');

export default class MoviePresenter {
  #filmListContainer = null;
  #changeData = null;
  #changeMode = null;
  #commentsModel = null;
  #filmComponent = null;
  #filmEditComponent = null;
  #film = null;
  #comments = null;
  #scroll = null;
  #isDeleting = null;
  #isDisabled = null;
  #idCommentDelete = null;
  #emotion = ' ';
  #newCommentText = '';
  #mode = Mode.DEFAULT;

  constructor(filmListContainer, changeData, changeMode, commentsModel) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
    this.#isDeleting = false;
  }

  init = (film, comments, idCommentDelete) => {
    this.#film = film;
    this.#comments = comments;
    this.#idCommentDelete = idCommentDelete;
    const prevFilmComponent = this.#filmComponent;
    const prevFilmEditComponent = this.#filmEditComponent;
    this.#filmComponent = new CardFilmView(film, this.#comments);

    this.#filmEditComponent = new FilmInformationView(this.#film, this.#comments, this.#emotion, this.#newCommentText, this.#isDeleting, this.#idCommentDelete, this.#isDisabled);
    this.#filmEditComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmEditComponent.setHistoryClickHandler(this.#historyClickHandler);
    this.#filmEditComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmEditComponent.setEditClickHandler(this.#editClickHandler);
    this.#filmEditComponent.setDeleteClickHandler(this.#commentDeleteClickHandler);
    this.#filmEditComponent.setAddClickHandler(this.#commentAddClickHandler);
    this.#filmEditComponent.setCommentsEmotionClickHandler(this.#emotionClickHandler);
    this.#filmEditComponent.setCommentNewTextClickHandler(this.#commentTextClickHandler);


    this.#filmComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmComponent.setHistoryClickHandler(this.#historyClickHandler);
    this.#filmComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmComponent.setCardClickHandler(this.#cardClickHandler);

    if (prevFilmComponent === null || prevFilmEditComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmListContainer.element.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (bodyElement.contains(prevFilmEditComponent.element)) {
      replace(this.#filmEditComponent, prevFilmEditComponent);
      this.#filmEditComponent.element.scrollTop = this.#scroll;
    }

    remove(prevFilmComponent);
    remove(prevFilmEditComponent);
  }

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#isDeleting = false;
      this.#isDisabled = false;
      this.#changeData(
        UserAction.UPDATE_FILM_WITH_COMMENTS,
        UpdateType.PATCH,
        { ...this.#film, },
        this.#comments);
    };

    const resetFormStateAddComment = () => {
      this.#isDeleting = false;
      this.#isDisabled = false;
      this.#changeData(
        UserAction.UPDATE_FILM_WITH_COMMENTS,
        UpdateType.PATCH,
        { ...this.#film, },
        this.#comments);
    };

    switch (state) {
      case State.SUCCESS:
        this.#filmEditComponent.resetDataForNewComment();
        this.#emotion = ' ';
        this.#newCommentText = '';
        break;
      case State.SAVING:
        this.#isDisabled = false;
        this.#filmEditComponent.updateData({
          isDisabled: false,
        });
        break;
      case State.DELETING:
        this.#isDeleting = false;
        this.#filmEditComponent.updateData({
          isDeleting: false,
        });
        break;
      case State.ABORTING:
        this.#filmComponent.shake(resetFormState);
        this.#filmEditComponent.shake(resetFormState);
        break;
      case State.ABORTING_NEW_COMMENT:
        this.#filmEditComponent.shake(resetFormStateAddComment);
        break;
    }
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

  #onGetFormCardInfoClick = async () => {
    if (bodyElement.querySelector('.film-details')) {
      bodyElement.querySelector('.film-details').remove();
    }
    bodyElement.classList.add('hide-overflow');
    this.#comments = this.#commentsModel.getComments(this.#film.id);
    bodyElement.appendChild(this.#filmEditComponent.element, RenderPosition.BEFOREEND);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
    this.#filmEditComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmEditComponent.setHistoryClickHandler(this.#historyClickHandler);
    this.#filmEditComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmEditComponent.setEditClickHandler(this.#editClickHandler);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#filmEditComponent.reset(this.#film, this.#comments);
      this.#onReplaceFormCardInfoClick();
    }
  }

  #cardClickHandler = () => {
    this.#onGetFormCardInfoClick();
  }

  #editClickHandler = () => {
    this.#emotion = ' ';
    this.#newCommentText = '';
    this.#onReplaceFormCardInfoClick();
  }

  #favoriteClickHandler = (comments) => {
    this.#scroll = this.#filmEditComponent?.element?.scrollTop || 0;
    this.#comments = comments;
    this.#changeData(
      bodyElement.querySelector('.film-details') ? UserAction.UPDATE_FILM_WITH_COMMENTS : UserAction.UPDATE_FILM,
      bodyElement.querySelector('.film-details') ? UpdateType.PATCH : UpdateType.MINOR,
      { ...this.#film, isFavorites: !this.#film.isFavorites },
      this.#comments);
  }

  #historyClickHandler = (comments) => {
    this.#scroll = this.#filmEditComponent?.element?.scrollTop || 0;
    this.#comments = comments;
    this.#changeData(
      bodyElement.querySelector('.film-details') ? UserAction.UPDATE_FILM_WITH_COMMENTS : UserAction.UPDATE_FILM,
      bodyElement.querySelector('.film-details') ? UpdateType.PATCH : UpdateType.MINOR,
      { ...this.#film, isWatched: !this.#film.isWatched }, this.#comments);
  }

  #watchlistClickHandler = (comments) => {
    this.#scroll = this.#filmEditComponent?.element?.scrollTop || 0;
    this.#comments = comments;
    this.#changeData(
      bodyElement.querySelector('.film-details') ? UserAction.UPDATE_FILM_WITH_COMMENTS : UserAction.UPDATE_FILM,
      bodyElement.querySelector('.film-details') ? UpdateType.PATCH : UpdateType.MINOR,
      { ...this.#film, isWatchlist: !this.#film.isWatchlist }, this.#comments);
  }

  #commentDeleteClickHandler = (film, id, comments, isDeleting) => {
    this.#isDeleting = isDeleting;
    this.#scroll = this.#filmEditComponent?.element?.scrollTop || 0;
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      film,
      id,
      comments,
    );
  }

  #commentAddClickHandler = (film, comment, comments, emotionNew, commentTextNew, isDisabled) => {
    this.#isDisabled = isDisabled;
    this.#scroll = this.#filmEditComponent?.element?.scrollTop || 0;
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

  #emotionClickHandler = (emotion) => {
    this.#emotion = emotion;
  };

  #commentTextClickHandler = (text) => {
    this.#newCommentText = text;
  }
}
