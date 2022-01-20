import AbstractObservable from '../utils.js';
import { UpdateType } from '../consts.js';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #filmComments = [];
  #comments = [];
  #filmsModel = [];

  constructor(apiService, filmsModel) {
    super();
    this.#apiService = apiService;
    this.#filmsModel = filmsModel;
  }

  setcomments(comments) {
    this.#comments = [...comments];
    this._notify('INIT', this.#comments);
  }

  getcomments(id) {
    const currentFilm = this.#comments.find((item) => Number(item.id) === Number(id));
    return currentFilm && currentFilm.comments ? currentFilm.comments : [];
  }

  init = () => {
    this.#filmsModel.addObserver((type) => {
      if (type !== UpdateType.INIT) { return; }
      const comments = this.#filmsModel.films.map((film) => this.#apiService.getComments(film.id));
      Promise.all(comments).then((result) => { this.setcomments(result); });
    });
  }

  updateComments = async (updateType, update, comments) => {
    this.#filmComments = comments;

    this._notify(updateType, update, this.#filmComments);

  }

  async addComment(updateType, update, newComment, comments) {
    this.#filmComments = comments;
    try {
      const response = await this.#apiService.addComment(newComment, update);
      this.#filmComments = [
        ...this.#filmComments,
        response.comments[response.comments.length -1],
      ];
      this._notify(updateType, update, this.#filmComments);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  }

  async deleteComment(updateType, update, id, comments) {
    this.#filmComments = comments;
    const index = this.#filmComments.findIndex((comment) => comment.id === id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(this.#filmComments[index]);
      this.#filmComments = [
        ...this.#filmComments.slice(0, index),
        ...this.#filmComments.slice(index + 1),
      ];
      this._notify(updateType, update, this.#filmComments);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  }

  adaptCommentToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        id: String(comment['id']),
        author: comment['author'],
        emotion: comment['emotion'],
        comment: comment['comment'],
        date: comment['date'],
      },
    );

    //delete comment['id'];
    delete comment['author'];
    delete comment['emotion'];
    delete comment['comment'];
    delete comment['date'];
    // eslint-disable-next-line no-console
    console.log(adaptedComment);
    return adaptedComment;
  }

}

