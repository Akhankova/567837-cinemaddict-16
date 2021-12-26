import {getTime, createMessageCard} from '../utils.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import AbstractView from './abstract-view.js';

const createCardFilmTemplate = (card) => {
  const {title, totalRating, genre, runtime, poster, description, comments, filmDate, isWatchlist, isWatched, isFavorites} = card;
  const date = dayjs(filmDate).format('YYYY');
  const filmRuntime = getTime(runtime);
  const descriptionCard = createMessageCard(description);

  const washListClassName = isWatchlist
    ? 'film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item film-card__controls-item--add-to-watchlist';

  const watchingClassName = isWatched
    ? 'film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item film-card__controls-item--mark-as-watched';

  const favoriteClassName = isFavorites
    ? 'film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active'
    : 'film-card__controls-item film-card__controls-item--favorite';

  return (
    `<article class="film-card">
    <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${date}</span>
      <span class="film-card__duration">${filmRuntime}</span>
      <span class="film-card__genre">${genre.join(', ')}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${descriptionCard}</p>
    <span class="film-card__comments">${comments} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="${washListClassName}" type="button">Add to watchlist</button>
      <button class="${watchingClassName}" type="button">Mark as watched</button>
      <button class="${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`
  );
};

export default class CardFilmView extends AbstractView {
  #card = null;

  constructor(card) {
    super();
    this.#card = card;
  }

  get template() {
    return createCardFilmTemplate(this.#card);
  }

  setCardClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#cardClickHandler);
  }

  #cardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setHistoryClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }
}

