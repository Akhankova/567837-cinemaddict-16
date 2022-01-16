import AbstractObservable from '../utils.js';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #filmComments = [];
  #comments = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  setcomments(comments) {
    this.#comments = [...comments];
    this._notify('INIT', this.#comments);
  }

  getcomments(id) {
    const currentFilm = this.#comments.find((item) => Number(item.id) === Number(id));
    return  currentFilm && currentFilm.comments ? currentFilm.comments : [];
  }

  getСommentItems = async (id) => {
    try {
      const comments = await this.#apiService.getComments(id);
      this.#filmComments = [...comments];
      return this.#filmComments;
    } catch (err) {
      this.#filmComments = [];
    }
    return this.#filmComments;
  }

  updateComments = async(updateType, update, comments) => {
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

  adaptCommentToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        id: comment['id'],
        author: comment['author'],
        emotion: comment['emotion'],
        comment: comment['comment'],
        date: comment['date'],
      },
    );

    delete comment['id'];
    delete comment['author'];
    delete comment['emotion'];
    delete comment['comment'];
    delete comment['date'];

    return adaptedComment;
  }

}

