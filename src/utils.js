import { MINUTES } from './consts';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import {FilterType} from './consts.js';

const DESCRIPTION_LENGTH = 140;
const DESCRIPTION_LENGTH_SHOW = 139;

export const getTime = (runtime) => {
  const dur = dayjs.duration({minutes: runtime}).format('mm');
  const hours = Math.floor(dur/MINUTES);
  const minutes = dur%MINUTES;
  return hours > 0 ? `${hours}h ${minutes}m` : `$${minutes}m`;
};

export const createMessageCard = (text) => {
  if (text.length >= DESCRIPTION_LENGTH) {
    text = `${text.substr(0, DESCRIPTION_LENGTH_SHOW)}...`;
    return text;
  }
  return text;
};

export default class AbstractObservable {
  #observers = new Set();

  addObserver(observer) {
    this.#observers.add(observer);
  }

  removeObserver(observer) {
    this.#observers.delete(observer);
  }

  _notify(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}

export const filter = {
  [FilterType.ALL]: (cards) => cards.filter((card) => card),
  [FilterType.WATHLIST]: (cards) => cards.filter((card) => card.isWatchlist),
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.isWatched),
  [FilterType.FAVORITES]: (cards) => cards.filter((card) => card.isFavorites),
};

