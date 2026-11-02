import { fetchJson } from './client.js';

export async function searchBooks(query, page = 1, signal) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: '20'
  });

  const data = await fetchJson(`/search.json?${params}`, { signal });
  
  // Преобразуем ответ Open Library под наш формат карточек
  const books = (data.docs || []).map(doc => ({
    id: doc.key,
    title: doc.title || 'Без названия',
    author: doc.author_name ? doc.author_name.join(', ') : 'Неизвестный автор',
    year: doc.first_publish_year || '—',
    genre: doc.subject ? doc.subject[0] : 'Книга',
    rating: (Math.random() * 2 + 3).toFixed(1), // Заглушка, так как в API нет рейтинга
    available: true
  }));

  return {
    books,
    totalFound: data.numFound || 0,
    totalPages: Math.ceil((data.numFound || 0) / 20)
  };
}

export async function getBookDetails(key, signal) {
  const data = await fetchJson(`${key}.json`, { signal });
  return {
    id: key,
    title: data.title || 'Без названия',
    description: typeof data.description === 'string' ? data.description : (data.description?.value || 'Описание отсутствует.'),
    // Другие поля можно добавить по желанию
  };
}