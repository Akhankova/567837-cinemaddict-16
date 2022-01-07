import AbstractView from './abstract-view.js';
import {FilterType} from '../consts.js';

const NoCardsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.WATHLIST]: 'There are no movies to watch now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

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

