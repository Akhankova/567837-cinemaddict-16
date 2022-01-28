import AbstractView from './abstract-view.js';
import {NoCardsTextType} from '../consts.js';

const createNoCardsTemplate = (filterType) => {
  const noTaskTextValue = NoCardsTextType[filterType];

  return (
    `<h2 class="films-list__title">${noTaskTextValue}</h2>
      `);
};

export default class NoCardsView extends AbstractView{
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoCardsTemplate(this._data);
  }
}

