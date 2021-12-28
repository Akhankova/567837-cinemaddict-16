import AbstractObservable from '../utils.js';

export default class CommentsModel extends AbstractObservable {
  #films = [];
  #filmComments = [];

  set comments(films) {
    this.#films = [...films];
  }

  get comments() {
    return this.#filmComments;
  }

  addComment(updateType, update, innerUpdate) {
    const index = this.#films.findIndex((film) => film.id === update.id);

    this.#filmComments[index] = [...this.#filmComments[index], innerUpdate];
    update.filmComments = this.#filmComments[index];
    this.#films[index] = update;
    this._notify(updateType, update);
  }

  deleteComment(updateType, update, id) {
    const index = this.#films.findIndex((film) => film.id === update.id);
    this.#filmComments = this.#films[index].commentsText;
    const indexComment = this.#filmComments.findIndex((comment) => comment.id === id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#filmComments = [
      ...this.#filmComments.slice(0, indexComment),
      ...this.#filmComments.slice(indexComment + 1),
    ];

    this._notify(updateType, update, this.#filmComments);
  }
}

