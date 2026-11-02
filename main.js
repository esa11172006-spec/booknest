import { books } from './data/books.js';
import { getVisibleBooks } from './lib/books.js';
import { render } from './ui/render.js';

const LS_KEY = 'booknest_state_v1';

function loadState() {
  const def = { query: '', genre: '', sortBy: 'title', onlyAvailable: false, wishlist: [] };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return def;
    const parsed = JSON.parse(raw);
    return { ...def, ...parsed };
  } catch (e) {
    console.warn('Ошибка чтения localStorage', e);
    return def;
  }
}

let state = loadState();

function update() {
  const visibleBooks = getVisibleBooks(books, state);
  render({ visibleBooks, state });
  
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Ошибка сохранения', e);
  }
}

const form = document.querySelector('.filters-form');
if (form) {
  form.addEventListener('submit', (e) => e.preventDefault());

  form.addEventListener('input', (e) => {
    // Убрали type, чтобы ESLint не ругался
    const { name, value, checked } = e.target; 
    
    if (name === 'query') state = { ...state, query: value };
    if (name === 'genre') state = { ...state, genre: value };
    if (name === 'sortBy') state = { ...state, sortBy: value };
    if (name === 'onlyAvailable') state = { ...state, onlyAvailable: checked };
    
    update();
  });
}

document.addEventListener('click', (e) => {
  // Кнопка "Хочу прочитать" / "Удалить"
  const btn = e.target.closest('[data-action="toggle-wishlist"]');
  if (btn) {
    const id = Number(btn.dataset.id);
    const inList = state.wishlist.includes(id);
    state = {
      ...state,
      wishlist: inList ? state.wishlist.filter(x => x !== id) : [...state.wishlist, id]
    };
    update();
  }

  // Кнопка "Сбросить"
  const resetBtn = e.target.closest('.reset-btn');
  if (resetBtn) {
    state = { query: '', genre: '', sortBy: 'title', onlyAvailable: false, wishlist: state.wishlist };
    if (form) form.reset(); 
    update();
  }
});

update();