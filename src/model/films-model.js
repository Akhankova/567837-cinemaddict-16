import AbstractObservable from '../utils.js';
import {UpdateType} from '../consts.js';

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
    } catch(err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  }

  updateFilm = async(updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateMovie(update);
      const updatedMovie = this.adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        update,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedMovie);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  }

  addFilm = (updateType, update) => {
    this.#films = [
      update,
      ...this.#films,
    ];

    this._notify(updateType, update);
  }

  deleteFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType);
  }

  adaptToClient(card) {
    // eslint-disable-next-line no-console
    console.log(card);
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
        //descriptionCard: createMessageCard(textDescription),
        description: card['film_info']['description'],
        //comments: commentsText.length,
        //commentsText: commentsText,
        isWatchlist: card['user_details']['watchlist'],
        isWatched: card['user_details']['already_watched'],
        //watchingDate: getRandomArbitrary(DATE_MAX_WATCH, DATE_MIN_WATCH),
        watchingDate: card['user_details']['watching_date'],
        isFavorites: card['user_details']['favorite'],
        //smile: '',

      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedCard['film_info'];
    delete adaptedCard['user_details'];
    return adaptedCard;
  }
}
