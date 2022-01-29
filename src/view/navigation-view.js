import AbstractView from './abstract-view.js';
import {MenuItem} from '../consts.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { name, count } = filter;
  return (
    `
    <a href="#${name}"  value="${MenuItem.FILTERS}" name='${name}' class="main-navigation__item ${name === currentFilterType ? 'main-navigation__item--active' : ''}">${name !== 'All' ? name : `${name} movies`} ${name === 'All' ? ' ' : `<span class="main-navigation__item-count">${count}</span>`}</a>
    `
  );
};

const createMainNavigation = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
    ${filterItemsTemplate}
      </div>
    <a href="#stats" name='stats' value="${MenuItem.STATISTICS}" class="main-navigation__additional ${currentFilterType === 'stats' ? 'main-navigation__item--active' : ''}">Stats</a>
  </nav>`
  );
};

export default class NavigationView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createMainNavigation(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'SPAN') {
      return;
    }
    this._callback.filterTypeChange(evt.target.name);
  }
}
