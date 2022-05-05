import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import searchView from './views/searchView.js';
import ResultsView from './views/resultsView';
import PaginationView from './views/paginationView';
import movieView from './views/movieView';
import BookmarkView from './views/bookmarkView';

/////////////////////////////////////////////////////////////

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}
const controlMovies = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) {
      await model.loadMovie(id);
      movieView.render(model.state.movie, true);
      return;
    }
    // // Update selected result
    const resultsToDisplay = model.getResultsPage();
    ResultsView.update(resultsToDisplay);

    // //  Loading movie
    movieView.renderSpinner();
    await model.loadMovie(id);

    // //  Render movie
    movieView.render(model.state.movie);

    // // Re-render bookmarks
    BookmarkView.update(model.getBookmarks());
  } catch (error) {
    movieView.renderError();
  }
};

const controlSearchResults = async function () {
  // Get search query
  const query = searchView.getSearchValue();
  if (!query) return;

  // Load results
  ResultsView.renderSpinner();
  await model.loadSearchResults(query);

  // // Render results
  const resultsToDisplay = model.getResultsPage();
  ResultsView.render(resultsToDisplay);

  // // Render pagination
  const pagination = model.getPagination();
  PaginationView.render(pagination);

  // // Re-render bookmarks
  BookmarkView.update(model.getBookmarks());
};

const controlClearResults = async function () {
  const id = window.location.hash.slice(1);
  if (!id) {
    await model.loadSearchResults('', true);
    ResultsView.render([], true);
  }
};
const controlClearPagination = function () {
  const id = window.location.hash.slice(1);
  if (!id) {
    PaginationView.render({next:false, prev:false});
  }
};

const controlPagination = function (pageNumber = 1) {
  // Render results
  const resultsToDisplay = model.getResultsPage(pageNumber);
  ResultsView.render(resultsToDisplay);

  // Render pagination
  const pagination = model.getPagination();
  PaginationView.render(pagination);
};

const controlToggleBookmark = function () {
  model.toggleBookmark();
  BookmarkView.render(model.getBookmarks());
  movieView.update(model.state.movie);
};

const controlBookmarks = function () {
  BookmarkView.render(model.getBookmarks());
};

const registerHandlers = function () {
  searchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerPagination(controlPagination);
  movieView.addHandlerRender(controlMovies, controlClearResults, controlClearPagination);
  movieView.addHandlerBookmark(controlToggleBookmark);
  BookmarkView.addHandlerRender(controlBookmarks);
};

registerHandlers();
