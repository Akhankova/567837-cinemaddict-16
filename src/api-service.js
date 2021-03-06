const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get movies() {
    return this.#load({ url: 'movies' })
      .then(ApiService.parseResponse);
  }

  getComments(filmId) {
    return this.#load({ url: `comments/${filmId}` })
      .then(ApiService.parseResponse).then((commentsText) => ({ id: filmId, comments: commentsText }));
  }

  updateMovie = async (movie) => {
    const response = await this.#load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.adaptToServer(movie)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return await ApiService.parseResponse(response);
  }

  addComment = async (comment, film) => {
    const response = await this.#load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(this.adaptCommentToServer(comment)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return await ApiService.parseResponse(response);
  }

  deleteComment = async (comment) => await this.#load({
    url: `comments/${comment.id}`,
    method: Method.DELETE,
  })

  updateComments = async (film, comment) => {
    const response = await this.#load({
      url: `comments/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.adaptCommentToServer(comment)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      { method, body, headers },
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }

  adaptToServer(card) {
    const adaptedCard = Object.assign(
      {},
      card,
      {
        'comments': card.comments.map((comment) => comment.id ? comment.id : comment),
        'id': card.id,
        'film_info': {
          'title': card.title,
          'alternative_title': card.alternativeTitle,
          'total_rating': card.totalRating,
          'poster': card.poster,
          'age_rating': card.ageRating,
          'director': card.director,
          'writers': card.writers,
          'actors': card.actors,
          'release': {
            'date': String(card.filmDate),
            'release_country': String(card.releaseCountry),
          },
          'runtime': card.runtime,
          'genre': card.genre,
          'description': card.description,
        },
        'user_details': {
          'watchlist': card.isWatchlist,
          'already_watched': card.isWatched,
          'watching_date': card.watchingDate,
          'favorite': card.isFavorites,
        },
      },
    );
    delete adaptedCard.alternativeTitle;
    delete adaptedCard.totalRating;
    delete adaptedCard.poster;
    delete adaptedCard.ageRating;
    delete adaptedCard.director;
    delete adaptedCard.writers;
    delete adaptedCard.actors;
    delete adaptedCard.runtime;
    delete adaptedCard.genre;
    delete adaptedCard.description;
    delete adaptedCard.isWatchlist;
    delete adaptedCard.isWatched;
    delete adaptedCard.watchingDate;
    delete adaptedCard.isFavorites;
    delete adaptedCard.filmDate;
    delete adaptedCard.releaseCountry;
    delete adaptedCard.smile;
    delete adaptedCard.value;
    delete adaptedCard.title;

    return adaptedCard;
  }

  adaptCommentToServer(comment) {

    const adaptedComment = Object.assign(
      {},
      {
        ['emotion']: comment.emotion,
        ['comment']: comment.comment,
      },
    );
    delete adaptedComment.id;
    delete adaptedComment.date;
    return adaptedComment;
  }
}
