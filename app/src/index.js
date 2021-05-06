/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
const API_URL = 'https://api.themoviedb.org/3/discover/movie';
const API_KEY = 'd32f4d7dd5677076b7f9396a736b2491';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesList = document.querySelector('.movies-list');

window.onload = () => {
  showApp();
};

async function showApp(page) {
  const total = 20; // limit of pages
  const data = await fetchMovies('popularity.desc', page);
  displayPagesList(data.page, createPagesList(data.page, total), total);
  displayMovies(data.results);
}

async function fetchMovies(sortby = 'popularity.desc', page = 1) {
  const url = `${API_URL}?api_key=${API_KEY}&language=en-US&sort_by=${sortby}&page=${page}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function displayMovies(movies) {
  moviesList.innerHTML = '';
  movies.forEach((movie) => {
    const {
      title, poster_path, release_date, vote_average,
    } = movie;
    const movieItem = document.createElement('li');
    movieItem.innerHTML = `
        <img src=${IMG_BASE_URL + poster_path} alt ="${title}">
        <p>${release_date.substring(0, 4)}</p>
        <span>${vote_average}</span>
        <h2>${title}</h2>
          `;
    moviesList.appendChild(movieItem);
  });
}

const pagination = document.querySelector('.pagination');

document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('page__btn--next')) {
    const current = document.querySelector('.page__item--current');
    pagination.innerHTML = '';
    showApp(+current.innerHTML + 1);
  } else if (e.target && e.target.classList.contains('page__btn--prev')) {
    const current = document.querySelector('.page__item--current');
    pagination.innerHTML = '';
    showApp(+current.innerHTML - 1);
  } else if (e.target && e.target.classList.contains('page__item')) {
    pagination.innerHTML = '';
    showApp(e.target.innerHTML);
  }
});

function createPagesList(page, total) {
  let pagesList = [];
  pagesList.length = 5;
  switch (page) {
    case 1:
    case 2:
      pagesList = [1, 2, 3, 4, 5];
      break;
    case total - 1:
    case total:
      pagesList = [total - 4, total - 3, total - 2, total - 1, total];
      break;
    default:
      pagesList = [page - 2, page - 1, page, page + 1, page + 2];
      break;
  }
  return pagesList;
}

function displayPagesList(page, arr, total) {
  if (page !== 1) {
    const prev = document.createElement('li');
    prev.className = 'page__btn page__btn--prev';
    prev.innerHTML = 'prev';
    pagination.appendChild(prev);
  }
  for (let i = 0; i < arr.length; i += 1) {
    const pageItem = document.createElement('li');
    if (arr[i] === page) {
      pageItem.className = 'page__item page__item--current';
    } else {
      pageItem.className = 'page__item';
    }
    pageItem.innerHTML = arr[i];
    pagination.appendChild(pageItem);
  }
  if (page !== total) {
    const next = document.createElement('li');
    next.className = 'page__btn page__btn--next';
    next.innerHTML = 'next';
    pagination.appendChild(next);
  }
}
