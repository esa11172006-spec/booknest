import { searchBooks } from './api/books.js';
import { render } from './ui/render.js';

const LS_KEY = 'booknest_wishlist_v1';

// Загружаем только список желаемого
function loadWishlist() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

const state = {
  status: 'empty', // loading, success, empty, error
  query: '',
  page: 1,
  totalPages: 0,
  totalFound: 0,
  books: [],
  errorStatus: 0,
  wishlist: loadWishlist()
};

let abortController = null;

// Debounce
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

async function fetchData() {
  if (state.query.trim().length < 3) {
    state.status = 'empty';
    render(state);
    return;
  }

  // Отменяем предыдущий запрос
  if (abortController) abortController.abort();
  abortController = new AbortController();

  state.status = 'loading';
  render(state);

  try {
    const res = await searchBooks(state.query, state.page, abortController.signal);
    
    state.books = res.books;
    state.totalPages = res.totalPages;
    state.totalFound = res.totalFound;
    state.status = res.books.length === 0 ? 'empty' : 'success';
  } catch (error) {
    if (error.name === 'AbortError') return; // Игнорируем отмененные
    state.status = 'error';
    state.errorStatus = error.status;
  } finally {
    render(state); // Всегда снимаем лоадер
  }
}

const debouncedFetch = debounce(fetchData, 400);

// Слушатели
const form = document.querySelector('.filters-form');
form.addEventListener('submit', e => e.preventDefault());

form.addEventListener('input', (e) => {
  if (e.target.name === 'query') {
    state.query = e.target.value;
    state.page = 1;
    debouncedFetch();
  }
});

document.querySelector('.retry-btn').addEventListener('click', fetchData);

// Пагинация
document.querySelector('.prev-btn').addEventListener('click', () => {
  if (state.page > 1) { state.page--; fetchData(); }
});
document.querySelector('.next-btn').addEventListener('click', () => {
  if (state.page < state.totalPages) { state.page++; fetchData(); }
});

// Сброс
document.querySelector('.reset-btn').addEventListener('click', () => {
  state.query = '';
  state.page = 1;
  state.books = [];
  state.status = 'empty';
  form.reset();
  render(state);
});

// Wishlist (Делегирование)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action="toggle-wishlist"]');
  if (!btn) return;

  const id = btn.dataset.id;
  const book = state.books.find(b => b.id === id) || state.wishlist.find(b => b.id === id);
  
  if (!book) return;

  const index = state.wishlist.findIndex(b => b.id === id);
  if (index >= 0) {
    state.wishlist.splice(index, 1); // Удаляем
  } else {
    state.wishlist.push(book); // Добавляем полную инфу
  }

  localStorage.setItem(LS_KEY, JSON.stringify(state.wishlist));
  render(state);
});

// Первый запуск
render(state);