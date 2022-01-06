import AbstractObservable from '../utils.js';

export default class CommentsModel extends AbstractObservable {
  #filmComments = [];

  setcomments(comments) {
    this.#filmComments = [...comments];
  }

  getcomments(id) {
    const currentFilm = this.#filmComments.find((item) => item.id === id);
    return  currentFilm && currentFilm.comments ? currentFilm.comments : [];
  }

  updateComments = (updateType, update, comments) => {
    this.#filmComments = comments;

    this._notify(updateType, update, this.#filmComments);
  }

  addComment(updateType, update, newComment, comments) {
    this.#filmComments = comments;

    this.#filmComments = [
      ...this.#filmComments,
      newComment,
    ];

    this._notify(updateType, update, this.#filmComments);
  }

  deleteComment(updateType, update, id, comments) {
    this.#filmComments = comments;
    const index = this.#filmComments.findIndex((comment) => comment.id === id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#filmComments = [
      ...this.#filmComments.slice(0, index),
      ...this.#filmComments.slice(index + 1),
    ];

    this._notify(updateType, update, this.#filmComments);
  }

}

