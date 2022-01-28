import AbstractObservable from '../utils.js';
import { UpdateType } from '../consts.js';

export default class FilmsModel extends AbstractObservable {
  #films = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.movies;
      this.#films = films.map(this.adaptToClient);
    } catch (err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT, this.#films);
  }

  updateFilm = async (updateType, update, comments) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update film');
    }

    try {
      const response = await this.#apiService.updateMovie(update);
      const updatedMovie = this.adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        update,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedMovie, comments);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  }

  adaptToClient(card) {
    const adaptedCard = Object.assign(
      {},
      card,
      {
        comments: card['comments'],
        title: card['film_info']['title'],
        alternativeTitle: card['film_info']['alternative_title'],
        totalRating: card['film_info']['total_rating'],
        poster: card['film_info']['poster'],
        ageRating: card['film_info']['age_rating'],
        director: card['film_info']['director'],
        writers: card['film_info']['writers'],
        actors: card['film_info']['actors'],
        filmDate: card['film_info']['release']['date'],
        releaseCountry: card['film_info']['release']['release_country'],
        runtime: card['film_info']['runtime'],
        genre: card['film_info']['genre'],
        description: card['film_info']['description'],
        isWatchlist: card['user_details']['watchlist'],
        isWatched: card['user_details']['already_watched'],
        watchingDate: card['user_details']['watching_date'],
        isFavorites: card['user_details']['favorite'],

      },
    );
    delete adaptedCard['film_info'];
    delete adaptedCard['user_details'];
    return adaptedCard;
  }
}
