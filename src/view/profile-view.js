import { createElement } from '../render.js';

const getRating = (wachedMovies) => {
  if(wachedMovies === 0){
    return '';
  }
  if(wachedMovies <= 10){
    return 'Novice';
  }
  if(wachedMovies <= 20){
    return 'Fan';
  }
  if(wachedMovies >= 21){
    return 'Movie Buff';
  }
};

const createProfileTemplate = (films) => {
  const filmCount = films.filter((card) => card.isWatchlist).length;
  return (
    `<section class="header__profile profile">
    <p class="profile__rating">${getRating(filmCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
};

export default class ProfileView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createProfileTemplate(this.#films);
  }

  removeElement() {
    this.#element = null;
  }
}
