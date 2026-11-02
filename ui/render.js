import { books } from '../data/books.js';

export function render({ visibleBooks, state }) {
  const grid = document.querySelector('.catalog-grid');
  const counter = document.querySelector('.catalog-counter');
  const empty = document.querySelector('.empty-state');
  
  // 1. Заполняем жанры в селект (один раз)
  const genreSelect = document.querySelector('select[name="genre"]');
  if (genreSelect && genreSelect.options.length <= 1) {
    import('../data/books.js').then(({ genres }) => {
      genres.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        genreSelect.append(opt);
      });
    });
  }

  // 2. Очищаем сетки
  if (grid) grid.replaceChildren();
  const wishlistGrid = document.querySelector('.wishlist-grid');
  if (wishlistGrid) wishlistGrid.replaceChildren();

  // 3. Обновляем счетчики
  if (counter) counter.textContent = `Найдено книг: ${visibleBooks.length}`;
  const headerCounter = document.querySelector('.wishlist-counter');
  if (headerCounter) headerCounter.textContent = state.wishlist.length;

  // 4. Пустое состояние для каталога
  if (empty) empty.hidden = visibleBooks.length !== 0;
  if (grid) grid.hidden = visibleBooks.length === 0;

  // 5. Рендерим каталог
  if (grid) {
    visibleBooks.forEach(book => {
      const card = createCard(book, state);
      grid.append(card);
    });
  }

  // 6. Рендерим "Мой список"
  if (wishlistGrid) {
    const wishlistBooks = state.wishlist.map(id => books.find(b => b.id === id)).filter(Boolean);
    
    if (wishlistBooks.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'Список пуст. Добавьте книги из каталога.';
      wishlistGrid.append(p);
    } else {
      wishlistBooks.forEach(book => {
        const card = createCard(book, state, true);
        wishlistGrid.append(card);
      });
    }
  }
}

// Вспомогательная функция для создания карточки
function createCard(book, state, isWishlistView = false) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.id = book.id;

  const title = document.createElement('h3');
  title.className = 'card__title';
  title.textContent = book.title;

  const author = document.createElement('p');
  author.className = 'card__author';
  author.textContent = book.author;

  const meta = document.createElement('p');
  meta.className = 'card__meta';
  meta.textContent = `${book.year} г. | ${book.genre} | ★ ${book.rating}`;

  const btn = document.createElement('button');
  btn.className = 'button';
  btn.dataset.action = 'toggle-wishlist';
  btn.dataset.id = book.id;
  
  const inWishlist = state.wishlist.includes(book.id);
  btn.setAttribute('aria-pressed', inWishlist ? 'true' : 'false');
  
  if (isWishlistView) {
    btn.textContent = 'Удалить из списка';
    btn.classList.add('button--danger');
  } else {
    btn.textContent = inWishlist ? 'В списке' : 'Хочу прочитать';
    if (inWishlist) btn.classList.add('button--active');
  }

  card.append(title, author, meta, btn);
  return card;
}