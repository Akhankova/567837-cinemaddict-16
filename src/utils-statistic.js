import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

export const statisticsPeriod = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const getFilterMoviesPeriod = (cards, dateTo, dateFrom, currentInput) => {
  if(currentInput === statisticsPeriod.ALL_TIME){
    return cards.filter((card) => dayjs(card.watchingDate).isSameOrBefore(dayjs()));
  }
  if(currentInput === statisticsPeriod.TODAY){
    return cards.filter((card) => dayjs(card.watchingDate).isSame(dateTo, 'day'));
  }
  if(currentInput === statisticsPeriod.YEAR){
    return cards.filter((card) => dayjs(card.watchingDate).isBetween(dayjs().add(-365, 'day'), dayjs(), 'day'));
  }
  if(currentInput === statisticsPeriod.MONTH){
    return cards.filter((card) => dayjs(card.watchingDate).isBetween(dayjs().add(-30, 'day'), dayjs(), 'day'));
  }
  if(currentInput === statisticsPeriod.WEEK){
    return cards.filter((card) => dayjs(card.watchingDate).isBetween(dayjs().add(-7, 'day'), dayjs(), 'day'));
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
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

  return watchedFilmsStat;
};
