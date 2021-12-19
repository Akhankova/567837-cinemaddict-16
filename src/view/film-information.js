import he from 'he';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import {getTime} from '../utils.js';
import SmartView from './smart-view.js';

const creatCommentCountTemplate = (comments) => comments > 0 ? `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments}</span></h3>` : ' ';
const createFilmPopupCommentsTemplate = (commentLi) => {
  const {
    id,
    author,
    comment,
    dateComment,
    emotion,
  } = commentLi;
  return (
    `<li class="film-details__comment" id="${id}">
    <span class="film-details__comment-emoji">
      <img src="${emotion}" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dateComment}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
    </li>`);
};
const createFilmPopupAllCommentsTemplate = (commentsText) => commentsText.map((comment) => createFilmPopupCommentsTemplate(comment));

const createFilmInformationTemplate = (data) => {
  const {title, poster, alternativeTitle, totalRating, director, writers, actors, filmDate, runtime, releaseCountry, genre, description, ageRating, isWatchlist, isWatched, isFavorites, commentsText, commentText, commentEmotion, comments} = data;
  const filmRuntime = getTime(runtime);
  const washListClassName = isWatchlist
    ? 'film-details__control-button film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button film-details__control-button--watchlist';

  const watchedClassName = isWatched
    ? 'film-details__control-button film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button film-details__control-button--watched';

  const favoriteClassName = isFavorites
    ? 'film-details__control-button film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button film-details__control-button--favorite';


  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">
          <p class="film-details__age">${ageRating}+</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${filmDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${filmRuntime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${genre}</span>
                </td>
            </tr>
          </table>
          <p class="film-details__film-description">
          ${description}
          </p>
        </div>
      </div>
      <section class="film-details__controls">
        <button type="button" class="${washListClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="${watchedClassName}" id="watched" name="watched">Already watched</button>
        <button type="button" class="${favoriteClassName}"  id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        ${creatCommentCountTemplate(comments)}
        <ul class="film-details__comments-list">
        ${createFilmPopupAllCommentsTemplate(commentsText)}
        </ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${(commentEmotion !== undefined &&  commentEmotion !== ' ') ? `<img src="/images/emoji/${commentEmotion}.png"
          alt="emoji" width="55" height="55" value="${commentEmotion !== undefined ? commentEmotion : ' '}">` : ' ' }
          </div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(commentText !== undefined ? commentText : '')}</textarea>
          </label>
          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`);
};

export default class FilmInfotmationView extends SmartView {

  constructor(film) {
    super();
    this._data = film;

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmInformationTemplate(this._data);
  }

  restoreHandlers = () => {
    this.setEditClickHandler(this._callback.editClick);
    this.setHistoryClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setEmotionClickHandler();
    this.setFavoriteClickHandler(this._callback.favoriteClick );
  }

  #setInnerHandlers = () => {
    this.setEmotionClickHandler();
    this.setCommentInputHandler();
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#editClickHandler);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  setHistoryClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  setEmotionClickHandler = () => {
    const emojiItems = this.element.querySelectorAll('.film-details__emoji-item');
    emojiItems.forEach((element) => {
      element.addEventListener('click', this.#emotionClickHandler);
    });
  };

  setCommentInputHandler = () => {
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

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

  #emotionClickHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      commentEmotion: evt.target.value,
    });
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      commentText: evt.target.value,
    }, true);
  }

}

