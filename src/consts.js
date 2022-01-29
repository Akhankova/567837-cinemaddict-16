export const MINUTES = 60;
export const CARD_COUNT_PER_STEP = 5;
export const AUTHORIZATION = 'Basic hS2ssS66wcm1sa9j';
export const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

export const SortType = {
  DEFAULT: 'default',
  DATE_SORT: 'date-sort',
  RATING_SORT: 'rating-sort',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  UPDATE_FILM_WITH_COMMENTS: 'UPDATE_FILM_WITH_COMMENTS',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  ALL: 'All',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
  STATISTICS: 'Statistics',
};

export const MenuItem = {
  FILTERS: 'FILTERS',
  STATISTICS: 'STATISTICS',
};

export const NoCardsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

