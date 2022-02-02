import dayjs from 'dayjs';
import SmartView from '../view/smart-view.js';
import { getRating } from '../render.js';
import { getWatchedFilmsForStatistics } from '../utils-statistic.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const MINUTES = 60;
const BAR_HEIGHT = 50;
const MIN_VALUE = 0;
const TIME_VALUE = 1;
const YEAR_COUNT = 1;

const GenresChart = {
  BAR_THICKNESS: 24,
  SIZE: 20,
  OFFSET: 40,
  PADDING: 100,
  FONT_SIZE: 20,
};

const createStatisticsTemplate = (data) => {
  const {films, dateTo, dateFrom, currentInput} = data;
  const moviesForStatistic = getWatchedFilmsForStatistics(films, dateTo, dateFrom, currentInput);

  const keysGenres = Object.keys(moviesForStatistic.genres);
  const topGenre = keysGenres.sort((a, b) => moviesForStatistic.genres[b] - moviesForStatistic.genres[a])[MIN_VALUE];

  const getTotalDuration = (cards) => cards.reduce((acc, card) => (acc + card.runtime), MIN_VALUE);

  const duration = getTotalDuration(moviesForStatistic.movies);
  const hours = Math.floor(duration/MINUTES);
  const minutes = duration%MINUTES;


  return (
    `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${getRating(moviesForStatistic.cards.length)}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentInput === 'all-time'? 'checked' : ''}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentInput === 'today'? 'checked' : ''}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentInput === 'week'? 'checked' : ''}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentInput === 'month'? 'checked' : ''}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentInput === 'year'? 'checked' : ''}>
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${moviesForStatistic.movies.length} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${hours > MIN_VALUE ? hours : MIN_VALUE}<span class="statistic__item-description">h</span>${duration%MINUTES > MIN_VALUE ? minutes : MIN_VALUE}<span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre === undefined ? ' ' : topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`);
};

const renderGenresChart = (statisticCtx, data) => {
  const {films, dateTo, dateFrom, currentInput} = data;

  const moviesForStatistic = getWatchedFilmsForStatistics(films, dateTo, dateFrom, currentInput);
  statisticCtx.height = BAR_HEIGHT * Object.keys(moviesForStatistic.genres).length;

  const compareNumbers = (a, b) => b - a;
  const genresForChart = Object.values(moviesForStatistic.genres).sort(compareNumbers);
  const keysGenres = Object.keys(moviesForStatistic.genres);
  keysGenres.sort((a, b) => moviesForStatistic.genres[b] - moviesForStatistic.genres[a]);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: keysGenres,
      datasets: [{
        data: genresForChart,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: GenresChart.BAR_THICKNESS,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: GenresChart.SIZE,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: GenresChart.OFFSET,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: GenresChart.PADDING,
            fontSize: GenresChart.FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export default class StatisticsView extends SmartView {
  #statisticChart = null;

  constructor(films) {
    super();
    this._data = {
      films,
      dateFrom: (() => dayjs().subtract( YEAR_COUNT , 'year').toDate())(),
      dateTo: dayjs().toDate(),
      currentInput: 'all-time',
    };
    this.#statisticChart = null;
    this.#setCharts();
    this.setStatisticSortTypeChangeHandler();
  }

  get template() {
    return createStatisticsTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();
    if (this.#statisticChart) {
      this.#statisticChart.destroy();
      this.#statisticChart = null;
    }
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  setStatisticSortTypeChangeHandler() {
    this.element
      .querySelectorAll('.statistic__filters-input')
      .forEach((input) => input.addEventListener('click', this.#dateChangeHandler));
  }

  #dateChangeHandler = (evt) => {
    this.updateData(
      {
        currentInput: evt.target.value,
        dateFrom: (() => {
          const time = evt.target.value;
          return dayjs().subtract(TIME_VALUE , time).toDate();
        })(),

      },
    );
    this.setStatisticSortTypeChangeHandler();
    this.#setCharts();
  };

  #setCharts = () => {
    if (this.#statisticChart !== null) {
      this.#statisticChart = null;
    }
    const statisticCtx = this.element.querySelector('.statistic__chart');
    this.#statisticChart = renderGenresChart(statisticCtx, this._data);
  }
}

