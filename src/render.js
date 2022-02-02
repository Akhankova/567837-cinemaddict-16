import AbstractView from './view/abstract-view';

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const RatingValue = {
  NOVICE: 10,
  FAN: 20,
  BUFF: 21,
  NOT_RATING: 0,
};

export const render = (container, element, place) => {
  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      parent.before(child);
      break;
    case RenderPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      parent.append(child);
      break;
    case RenderPosition.AFTEREND:
      parent.after(child);
      break;
  }
};

export const getRating = (watchedMovies) => {
  if(watchedMovies === RatingValue.NOT_RATING){
    return '';
  }
  if(watchedMovies <= RatingValue.NOVICE){
    return 'Novice';
  }
  if(watchedMovies <= RatingValue.FAN){
    return 'Fan';
  }
  if(watchedMovies >= RatingValue.BUFF){
    return 'Movie Buff';
  }
};

export const getSortRateCard = (cardA, cardB) => cardB.totalRating - cardA.totalRating;
export const getSortDateCard = (a, b) => new Date(b.filmDate) - new Date(a.filmDate);

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
};

export const replace = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;
  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newChild, oldChild);
};

