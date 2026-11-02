import { getBookDetails } from '../api/books.js';

async function init() {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');

  const loading = document.querySelector('.loading-state');
  const errorEl = document.querySelector('.error-state');
  const errorText = document.querySelector('.error-text');
  const details = document.querySelector('.book-details');

  if (!bookId) {
    loading.hidden = true;
    errorEl.hidden = false;
    errorText.textContent = 'Книга не найдена (ID отсутствует).';
    return;
  }

  try {
    const book = await getBookDetails(bookId);
    loading.hidden = true;
    details.hidden = false;
    document.getElementById('book-title').textContent = book.title;
    document.getElementById('book-desc').textContent = book.description;
  } catch (error) {
    loading.hidden = true;
    errorEl.hidden = false;
    
    if (error.status === 404) {
      errorText.textContent = 'Книга не найдена (404).';
    } else {
      errorText.textContent = 'Ошибка загрузки данных.';
    }
  }
}

init();