import AbstractObservable from '../utils.js';
import { UpdateType } from '../consts.js';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #filmComments = [];
  #comments = [];
  #filmsModel = null;

  constructor(apiService, filmsModel) {
    super();
    this.#apiService = apiService;
    this.#filmsModel = filmsModel;
  }

  setComments(comments) {
    this.#comments = [...comments];
    this._notify('INIT', this.#comments);
  }

  getComments(id) {
    const currentFilm = this.#comments.find((item) => Number(item.id) === Number(id));
    return currentFilm && currentFilm.comments ? currentFilm.comments : [];
  }

  init = () => {
    this.#filmsModel.addObserver((type) => {
      if (type !== UpdateType.INIT) { return; }
      const comments = this.#filmsModel.films.map((film) => this.#apiService.getComments(film.id));
      Promise.all(comments).then((result) => { this.setComments(result); });
    });
  }

  updateComments = async (updateType, update, comments) => {
    this.#filmComments = comments;
    this._notify(updateType, update, this.#filmComments);
  }

  async addComment(updateType, update, newComment, comments) {
    this.#filmComments = comments;
    const filmIndex = this.#comments.find((item) => Number(item.id) === Number(update.id));
    try {
      const response = await this.#apiService.addComment(newComment, update);
      this.#filmComments = [
        ...this.#filmComments,
        response.comments[response.comments.length - 1],
      ];
      filmIndex.comments = this.#filmComments;

      this._notify(updateType, update, this.#filmComments);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  }

  async deleteComment(updateType, update, id, comments) {
    this.#filmComments = comments;
    const index = this.#filmComments.findIndex((comment) => comment.id === id);
    const filmIndex = this.#comments.find((item) => Number(item.id) === Number(update.id));
    this.#filmComments[index].commentDelete = false;

    if (index === -1) {
      throw new Error('Can\'t delete comment');
    }

    try {
      await this.#apiService.deleteComment(this.#filmComments[index]);
      this.#filmComments = [
        ...this.#filmComments.slice(0, index),
        ...this.#filmComments.slice(index + 1),
      ];
      filmIndex.comments = this.#filmComments;
      this._notify(updateType, update, this.#filmComments, id);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  }
}

