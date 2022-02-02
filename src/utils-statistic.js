import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

const MIN_VALUE_FOR_GENRES = 0;
const VALUE_FOR_GENRES = 1;

export const StatisticsPeriod = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const StatisticsDays = {
  WEEK: -7,
  MONTH: -30,
  YEAR: -365,
};

export const getFilterMoviesPeriod = (cards, dateTo, dateFrom, currentInput) => {
  if(currentInput === StatisticsPeriod.ALL_TIME){
    return cards.filter((card) => dayjs(card.watchingDate).isSameOrBefore(dayjs()));
  }
  if(currentInput === StatisticsPeriod.TODAY){
    return cards.filter((card) => dayjs(card.watchingDate).isSame(dateTo, 'day'));
  }
  if(currentInput === StatisticsPeriod.YEAR){
    return cards.filter((card) => dayjs(card.watchingDate).isBetween(dayjs().add(StatisticsDays.YEAR, 'day'), dayjs(), 'day'));
  }
  if(currentInput === StatisticsPeriod.MONTH){
    return cards.filter((card) => dayjs(card.watchingDate).isBetween(dayjs().add(StatisticsDays.MONTH, 'day'), dayjs(), 'day'));
  }
  if(currentInput === StatisticsPeriod.WEEK){
    return cards.filter((card) => dayjs(card.watchingDate).isBetween(dayjs().add(StatisticsDays.WEEK, 'day'), dayjs(), 'day'));
  }
  return cards.filter((card) =>
    dayjs(card.watchingDate).isSame(dateFrom , 'day') ||
    dayjs(card.watchingDate).isBetween(dateFrom, dateTo) ||
    dayjs(card.watchingDate).isSame(dateTo, 'day'),
  );
};

export const getWatchedFilmsForStatistics = (cards, dateTo, dateFrom, currentInput) => {
  const watchedFilmsStat = {
    cards: [],
    movies: [],
    genres: [],
    filmsCountWithSameGenres: [],
  };
  watchedFilmsStat.cards = cards.filter((card) => card.isWatched);
  cards = cards.filter((card) => card.isWatched);
  watchedFilmsStat.movies = getFilterMoviesPeriod(cards, dateTo, dateFrom, currentInput);
  const filmsGenres = [];
  watchedFilmsStat.movies.filter((film) => filmsGenres.push(film.genre));
  watchedFilmsStat.genres = filmsGenres.flat().reduce((acc, el) => {
    acc[el] = (acc[el] || MIN_VALUE_FOR_GENRES) + VALUE_FOR_GENRES;
    return acc;
  }, {});

  return watchedFilmsStat;
};
