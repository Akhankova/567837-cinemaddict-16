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

export const getRandomValue = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
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

  _notify(event, payload, payload2, payload3) {
    this.#observers.forEach((observer) => observer(event, payload, payload2, payload3));
  }
}

export const filter = {
  [FilterType.ALL]: (cards) => cards.filter((card) => card),
  [FilterType.WATHLIST]: (cards) => cards.filter((card) => card.isWatchlist),
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.isWatched),
  [FilterType.FAVORITES]: (cards) => cards.filter((card) => card.isFavorites),
};

