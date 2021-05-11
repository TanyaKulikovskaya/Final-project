/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
const API_URL = 'https://api.themoviedb.org/3/';
const API_KEY = 'd32f4d7dd5677076b7f9396a736b2491';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesList = document.querySelector('.movies-list');

const movieSection = document.querySelector('.movie');
const movieContent = document.querySelector('.movie-content');

const sort = document.querySelector('.select-sort');
const pagination = document.querySelector('.pagination');

window.onload = () => {
  showApp();
};

async function showApp(page = 1) {
  const total = 20; // limit of pages
  const sortby = sort.value;
  const data = await fetchMovies(sortby, page);
  displayPagesList(data.page, createPagesList(data.page, total), total);
  displayMovies(data.results);
}

async function fetchMovies(sortby, page) {
  const url = `${API_URL}discover/movie?&vote_count.gte=1000&api_key=${API_KEY}&language=en-US&sort_by=${sortby}&page=${page}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function displayMovies(movies) {
  moviesList.innerHTML = '';
  movies.forEach((movie) => {
    const {
      title, id, poster_path, release_date, vote_average,
    } = movie;
    const movieItem = document.createElement('li');
    movieItem.setAttribute('data-reference', id);
    movieItem.className = 'movie-item';
    movieItem.innerHTML = `
        <img src=${IMG_BASE_URL + poster_path} alt ="${title}">
        <p>Release: ${release_date.substr(0, 7).split('-').reverse().join('/')}</p>
        <span>Rating: ${vote_average}</span>
        <h2>${title}</h2>
          `;
    moviesList.appendChild(movieItem);
  });
}

sort.addEventListener('change', () => {
  const current = document.querySelector('.page__item--current');
  showApp(current.innerHTML);
});

pagination.addEventListener('click', (e) => {
  if (e.target.classList.contains('page__btn--next')) {
    const current = document.querySelector('.page__item--current');
    showApp(+current.innerHTML + 1);
  } else if (e.target.classList.contains('page__btn--prev')) {
    const current = document.querySelector('.page__item--current');
    showApp(+current.innerHTML - 1);
  } else if (e.target.classList.contains('page__item')) {
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
  pagination.innerHTML = '';
  if (page !== 1) {
    const prev = document.createElement('li');
    prev.className = 'page__btn page__btn--prev';
    prev.innerHTML = 'prev';
    pagination.appendChild(prev);
    window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);
  }
  if (page !== total) {
    const next = document.createElement('li');
    next.className = 'page__btn page__btn--next';
    next.innerHTML = 'next';
    pagination.appendChild(next);
    window.scrollTo(0, 0);
  }
}

moviesList.addEventListener('click', (e) => {
  if (e.target.classList.contains('movie-item') || e.target.parentElement.classList.contains('movie-item')) {
    const movieId = e.target.classList.contains('movie-item') ? (e.target.getAttribute('data-reference')) : (e.target.parentElement.getAttribute('data-reference'));
    showMovie(movieId);
  }
});

async function showMovie(id) {
  const data = await fetchMovie(id);
  displayMovie(data);
}

async function fetchMovie(id) {
  const url = `${API_URL}movie/${id}?api_key=${API_KEY}&language=en-US`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function displayMovie(movie) {
  movieSection.style.display === 'block' ? movieSection.style.display = 'none' : movieSection.style.display = 'block';
  const {
    title, original_title, poster_path, overview,
    popularity, release_date, vote_average, vote_count, genres,
  } = movie;
  movieContent.innerHTML = `
    <div class="movie-page__row">
      <div class="movie-page__img">
          <img src=${IMG_BASE_URL + poster_path} alt="${original_title}">
      </div>
      <div class="movie-page__text">
        <h2>${title}</h2>
        <p>${overview}</p>
        <h4><strong>Popularity:</strong> ${Math.round(popularity)}</h4>
        <h4><strong>Release date:</strong> ${release_date.split('-').reverse().join('/')}</h4>
        <h4><strong>Rating:</strong> ${vote_average}</h4>
        <h4><strong>Vote count:</strong> ${vote_count}</h4>
        <ul>Genres: ${getGenres(genres)}</ul>
      </div>
      <button class="close-button">X</button>
    </div>
      `;
  document.body.style.overflow = 'hidden';
  document.querySelector('html').scrollTop = window.scrollY;
}

function getGenres(genresArr) {
  let genres = '';
  genresArr.forEach((el) => {
    genres += `<li>${el.name}</li>`;
  });
  return genres;
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('close-button') || e.target.classList.contains('movie')) {
    closeMovie();
  }
});

function closeMovie() {
  movieSection.style.display = 'none';
  document.body.style.overflow = null;
}
