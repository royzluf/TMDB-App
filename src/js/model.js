import {
  API_URL,
  API_KEY,
  DISPLAY_RESULTS_LIMIT,
  POSTER_URL as IMAGE_URL,
  tmdbLogo,
} from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  movie: {},
  moviesResults: {
    query: '',
    results: [],
    resultLimit: DISPLAY_RESULTS_LIMIT,
    totalPages: 1,
    currentPage: 1,
  },
  bookmarks: {},
};

const createMovieObject = function (movieData) {
  const image = movieData?.poster_path
    ? `${IMAGE_URL}${movieData.poster_path}`
    : tmdbLogo;
  const systemLocale = navigator.language;
  let releaseDate = '';
  if (movieData?.release_date) {
    releaseDate =
      '' +
      new Intl.DateTimeFormat(systemLocale).format(
        new Date(movieData?.release_date)
      );
  }
  const genres =
    movieData?.genres && movieData?.genres.map(genre => genre.name);

  return {
    id: movieData.id,
    title: movieData.title,
    image,
    overview: movieData.overview,
    releaseDate,
    length: movieData.runtime,
    genres,
    bookmarked: state.bookmarks[movieData.id] ? true : false,
    ...(movieData.runtime && { length: movieData.runtime }),
  };
};

const updateMovieTrailer = async function (movie) {
  const url = `${API_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`;

  let movieTrailer = (await AJAX(url)).results.filter(
    video => video.site == 'YouTube'
  )[0];

  movieTrailer =
    movieTrailer && `https://www.youtube.com/watch?v=${movieTrailer.key}`;
  Object.assign(movie, movieTrailer && { trailer: movieTrailer });
};

export const loadMovie = async function (id) {
  try {
    if (!id) {
      state.movie = {};
      return;
    }

    const url = `${API_URL}/movie/${id}?api_key=${API_KEY}`;
    const data = await AJAX(url);
    state.movie = createMovieObject(data);
    await updateMovieTrailer(state.movie);
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query, clear = false) {
  try {
    if (clear) {
      state.moviesResults = {
        query: '',
        results: [],
        resultLimit: DISPLAY_RESULTS_LIMIT,
        totalPages: 1,
        currentPage: 1,
      };
      return;
    }
    state.moviesResults.query = query;
    state.moviesResults.currentIndex = 0;
    const url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`;
    const data = await AJAX(url);
    const movies = data.results;
    state.moviesResults.results = movies.map(createMovieObject);

    state.moviesResults.currentPage = 1;
    state.moviesResults.totalPages = Math.ceil(
      state.moviesResults.results.length / state.moviesResults.resultLimit
    );
  } catch (error) {
    throw error;
  }
};

export const getResultsPage = function (
  page = state.moviesResults.currentPage
) {
  state.moviesResults.currentPage = page;
  const start = (page - 1) * state.moviesResults.resultLimit;
  const end = page * state.moviesResults.resultLimit;
  return state.moviesResults.results.slice(start, end);
};

export const getPagination = function () {
  return {
    next:
      state.moviesResults.totalPages > 1 &&
      state.moviesResults.currentPage < state.moviesResults.totalPages
        ? state.moviesResults.currentPage + 1
        : false,
    prev:
      state.moviesResults.totalPages > 1 && state.moviesResults.currentPage > 1
        ? state.moviesResults.currentPage - 1
        : false,
    totalPages: state.moviesResults.totalPages,
  };
};

export const setRecipeByServings = function (servings = state.recipe.servings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      ingredient.quantity &&
      (ingredient.quantity * servings) / state.recipe.servings;
  });
  state.recipe.servings = servings;
  return state.recipe;
};

export const toggleBookmark = function (movie = state.movie) {
  // Add or remove bookmark
  if (state.bookmarks[movie.id]) {
    delete state.bookmarks[movie.id];
    state.movie.bookmarked = false;
  } else {
    state.bookmarks[movie.id] = movie;
    state.movie.bookmarked = true;
  }
  saveBookmarks();
};
export const getBookmarks = function () {
  return Object.values(state.bookmarks);
};

const saveBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const deleteBookmarks = function () {
  state.bookmarks = {};
  saveBookmarks();
};

const init = function () {
  const bookmarksStorage = JSON.parse(localStorage.getItem('bookmarks'));
  if (!bookmarksStorage) return;
  state.bookmarks = bookmarksStorage;
};

init();
