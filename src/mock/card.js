import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {nanoid} from 'nanoid';
dayjs.extend(duration);
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const DESCRIPTION_MIN = 1;
const DESCRIPTION_MAX = 5;
const RATING_MIN = 1;
const RATING_MAX = 10;
const TIME_MINUTE_MIN = 60;
const TIME_MINUTE_MAX = 300;
const YEAS_MIN = 0;
const YEAS_MAX = 18;
const YEAR_MIN = 0;
const YEAR_MAX = 0;
const MONTH_MIN = -11;
const MONTH_MAX = 0;
const DAY_MIN = -29;
const DAY_MAX = 0;
const GENRE_MIN = 1;
const GENRE_MAX = 3;
const AFTER_COMMA = 1;
const BOOLEAN_MIN = 0;
const BOOLEAN_MAX = 1;
const ELEMENT_MIN_VALUE = 0;
const ELEMENT_MAX_VALUE = 6;
const EMOTION_MAX = 3;
const ACTOR_MIN_COUNT = 2;
const ACTOR_MAX_COUNT= 6;
const MAX_COUNT= 10;
const MIN_COUNT = 0;
const DIRECTORS_MIN = 0;
const DIRECTORS_MAX = 6;
const WRITES_MIN = 0;
const WRITES_MAX = 6;
const COUNTRYS_MIN = 0;
const COUNTRYS_MAX = 5;
const CARD_INDEX_MIN = 0;
const CARD_INDEX_MAX = 6;
const DAY_RANDOM_MIN = -600;
const DAY_RANDOM_MAX = 0;

const getRandomValue = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const filmsNames = [
  'Made for each other',
  'Popeye meets sinbad',
  'Sagebrush trail',
  'Santa Claus conquers the martians',
  'The dance of life',
  'The great flamarion',
  'The man with the golden arm',
];

const filmsPosters = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];

const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const filmComments = [
  'I must, no I WILL see this - it looks to offer so much.',
  'I have not had chance to see this film yet, but from the trailer and review, it seems like a perfect tonic for this terrible times.',
  'It sounds very similar to the Flight of the Doves, which was on the vintage film channel recently.',
  'I really want people to watch these kind of movies. I wish more such inspirational movies to come.',
  'Feel good movie. One watch movie',
  'Great Movie. Liked it',
  'It is a good biographical movie',
  'Nice',
  'Not a good watch.',
];

const authors = [
  'Morgan Freeman',
  'Will Smith',
  'Morgan Freeman',
  'Nicholas Cage',
  'Brad Pitt',
  'Jim Carrey',
  'Jennifer Aniston',
];
const emotions = [
  './images/emoji/angry.png',
  './images/emoji/puke.png',
  './images/emoji/sleeping.png',
  './images/emoji/smile.png',
];
const directors = [
  'Takeshi Kitano',
  'William Shakespeare',
  'Emily Dickinson',
  'H. P. Lovecraft',
  'Arthur Conan Doyle',
  'Leo Tolstoy',
  'Edgar Allan Poe',
];
const countrys = [
  'Finland',
  'Brazil',
  'Germany',
  'India',
  'Russia',
  'United States of America',
];

const writers = [
  'Takeshi Kitano',
  'William Shakespeare',
  'Emily Dickinson',
  'H. P. Lovecraft',
  'Arthur Conan Doyle',
  'Leo Tolstoy',
  'Edgar Allan Poe',
];

const generateGenre = () => {
  const genresCount = getRandomValue(GENRE_MIN,GENRE_MAX);
  const genres = [
    'action',
    'drama',
    'horror',
    'animation',
    'comedy',
    'historical',
    'adventure',
  ];

  return new Array(genresCount)
    .fill()
    .map(() => genres[getRandomValue(0, genres.length - 1)]);
};

function getRandomFractional(min, max) {
  const numberFractional = Math.random() * (max - min + 1) + min;
  return  numberFractional.toFixed(AFTER_COMMA);
}

const getRandomDate = () => {
  const getRandomArbitrary = (min, max) => Math.floor(Math.random() * (max - min) + min);
  const yearRandom = getRandomArbitrary(YEAR_MIN, YEAR_MAX);
  const monthRandom = getRandomArbitrary(MONTH_MIN, MONTH_MAX);
  const dayRandom = getRandomArbitrary(DAY_MIN, DAY_MAX);
  const day = dayjs().add(yearRandom, 'year').add(monthRandom, 'month').add(dayRandom, 'day').toDate();
  return dayjs(day).format('DD MMMM YYYY');
};

const createDescriptionPopup = () => {
  const text = [];
  const numberOfMessage = getRandomValue(DESCRIPTION_MIN, DESCRIPTION_MAX);
  for (let index = 0; index < numberOfMessage; index ++) {
    text.push(descriptions[index]);
  }
  return text.join(' ');
};

const getActor = () => {
  const actorsCount = getRandomValue(ACTOR_MIN_COUNT, ACTOR_MAX_COUNT );
  const actors = [
    'Morgan Freeman',
    'Will Smith',
    'Morgan Freeman',
    'Nicholas Cage',
    'Brad Pitt',
    'Jim Carrey',
    'Jennifer Aniston',
  ];

  return new Array(actorsCount)
    .fill()
    .map(() => actors[getRandomValue(0, actors.length - 1)]);
};

const generateCommentDate = () => {
  const dayRandom = getRandomValue(DAY_RANDOM_MIN, DAY_RANDOM_MAX);
  const commentDate = dayjs().add(dayRandom, 'day').format('YYYY-MM-DD HH:mm:ss');
  return dayjs(commentDate).fromNow();
};

const getCommentText = (id) => (
  {
    id: id,
    author: authors[getRandomValue(ELEMENT_MIN_VALUE , ELEMENT_MAX_VALUE)],
    comment: filmComments[getRandomValue(ELEMENT_MIN_VALUE , ELEMENT_MAX_VALUE)],
    dateComment: generateCommentDate(),
    emotion: emotions[getRandomValue(ELEMENT_MIN_VALUE , EMOTION_MAX)]}
);

const getCommentsIdArray = () => {
  const idCount = getRandomValue(MIN_COUNT, MAX_COUNT );

  return new Array(idCount)
    .fill()
    .map(() => nanoid());
};

const getCreateFilmCard = () => {

  const index = getRandomValue(CARD_INDEX_MIN, CARD_INDEX_MAX);
  const textDescription = createDescriptionPopup();
  const date = dayjs(getRandomDate());
  const title = filmsNames[index];

  return {
    commentsId: getCommentsIdArray(),
    id: nanoid(),
    title: title,
    alternativeTitle: title,
    totalRating: getRandomFractional(RATING_MIN, RATING_MAX),
    poster: filmsPosters[index],
    ageRating: getRandomValue(YEAS_MIN, YEAS_MAX),
    director: directors[getRandomValue(DIRECTORS_MIN, DIRECTORS_MAX)],
    writers: [
      writers[getRandomValue(WRITES_MIN, WRITES_MAX)],
    ],
    actors: [
      getActor(),
    ],
    filmDate: date,
    releaseCountry: countrys[getRandomValue(COUNTRYS_MIN, COUNTRYS_MAX)],
    runtime: getRandomValue(TIME_MINUTE_MIN, TIME_MINUTE_MAX),
    genre: generateGenre(),
    description:  textDescription,
    isWatchlist: Boolean(getRandomValue(BOOLEAN_MIN, BOOLEAN_MAX)),
    isWatched: Boolean(getRandomValue(BOOLEAN_MIN, BOOLEAN_MAX)),
    watchingDate: dayjs(getRandomDate()).format('DD MMMM YYYY'),
    isFavorites: Boolean(getRandomValue(BOOLEAN_MIN, BOOLEAN_MAX)),
    smile: '',
  };
};

const cardToFilterMap = {
  All: (cards) => cards.filter((card) => card).length,
  Watchlist: (cards) => cards.filter((card) => card.isWatchlist).length,
  History: (cards) => cards.filter((card) => card.isWatched).length,
  Favorites: (cards) => cards.filter((card) => card.isFavorites).length,
};

export const generateFilter = (cards) => Object.entries(cardToFilterMap).map(
  ([filterName, countCards]) => ({
    name: filterName,
    count: countCards(cards),
  }),
);

export {getCreateFilmCard, getCommentText};
