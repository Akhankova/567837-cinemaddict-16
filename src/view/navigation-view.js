import { createElement } from '../render';

const createFilterItemTemplate = (filter) => {
  const { name, count } = filter;
  return (
    `
    <a href="#${name}" class="main-navigation__item main-navigation__item--active">${name !== 'All' ? name : `${name} movies`}<span class="main-navigation__item-count">${count}</span></a>
    `
  );
};

const createMainNavigation = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
    ${filterItemsTemplate}
      </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
  );
};

export default class NavigationView {
  #element = null;
  #filters = null;

  constructor(filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMainNavigation(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
