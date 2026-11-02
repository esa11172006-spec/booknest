export function render(state) {
  const grid = document.querySelector('.catalog-grid');
  const counter = document.querySelector('.catalog-counter');
  const wishlistGrid = document.querySelector('.wishlist-grid');
  const wishlistCounter = document.querySelector('.wishlist-counter');
  const pagination = document.querySelector('.pagination');

  // Элементы состояний
  const loadingEl = document.querySelector('.loading-state');
  const emptyEl = document.querySelector('.empty-state');
  const errorEl = document.querySelector('.error-state');
  const errorText = document.querySelector('.error-text');

  // Скрываем ВСЕ состояния (ровно одно покажем ниже)
  loadingEl.hidden = true;
  emptyEl.hidden = true;
  errorEl.hidden = true;
  grid.hidden = true;
  pagination.hidden = true;

  // 1. СОСТОЯНИЕ: ЗАГРУЗКА
  if (state.status === 'loading') {
    loadingEl.hidden = false;
  } 
  // 2. СОСТОЯНИЕ: ОШИБКА
  else if (state.status === 'error') {
    errorEl.hidden = false;
    if (state.errorStatus === 0) errorText.textContent = 'Нет подключения к интернету.';
    else if (state.errorStatus >= 400 && state.errorStatus < 500) errorText.textContent = 'Ошибка в запросе (4xx). Проверьте ввод.';
    else errorText.textContent = 'Ошибка на сервере (5xx). Попробуйте позже.';
  } 
  // 3. СОСТОЯНИЕ: ПУСТО
  else if (state.status === 'empty') {
    emptyEl.hidden = false;
  } 
  // 4. СОСТОЯНИЕ: УСПЕХ
  else if (state.status === 'success') {
    grid.hidden = false;
    pagination.hidden = false;
    
    // Рендер карточек
    grid.replaceChildren();
    state.books.forEach(book => {
      grid.append(createCard(book, state));
    });

    // Пагинация
    document.querySelector('.page-info').textContent = `Стр. ${state.page} из ${state.totalPages}`;
    document.querySelector('.prev-btn').disabled = state.page <= 1;
    document.querySelector('.next-btn').disabled = state.page >= state.totalPages;
  }

  // Счетчики и Мой список
  counter.textContent = `Найдено книг: ${state.totalFound || 0}`;
  wishlistCounter.textContent = state.wishlist.length;

  wishlistGrid.replaceChildren();
  if (state.wishlist.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'Список пуст.';
    wishlistGrid.append(p);
  } else {
    state.wishlist.forEach(book => {
      wishlistGrid.append(createCard(book, state, true));
    });
  }
}

function createCard(book, state, isWishlistView = false) {
  const card = document.createElement('article');
  card.className = 'card';
  
  const title = document.createElement('h3');
  title.className = 'card__title';
  title.textContent = book.title;

  const author = document.createElement('p');
  author.className = 'card__author';
  author.textContent = book.author;

  const meta = document.createElement('p');
  meta.className = 'card__meta';
  meta.textContent = `${book.year} г. | ★ ${book.rating}`;

  const btn = document.createElement('button');
  btn.className = 'button';
  btn.dataset.action = 'toggle-wishlist';
  btn.dataset.id = book.id;
  
  const inWishlist = state.wishlist.some(b => b.id === book.id);
  btn.setAttribute('aria-pressed', String(inWishlist));
  
  if (isWishlistView) {
    btn.textContent = 'Удалить';
    btn.classList.add('button--danger');
  } else {
    btn.textContent = inWishlist ? 'В списке' : 'Хочу прочитать';
    if (inWishlist) btn.classList.add('button--active');
  }

  // Ссылка на детали (передаем id через URL)
  const detailsLink = document.createElement('a');
  detailsLink.href = `book.html?id=${encodeURIComponent(book.id)}`;
  detailsLink.textContent = 'Подробнее';
  detailsLink.className = 'details-link';
  
  card.append(title, author, meta, detailsLink, btn);
  return card;
}