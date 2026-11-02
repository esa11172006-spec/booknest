import { fetchJson } from './client';
import type { Book } from '../types';

// Описываем типы для ответа от Open Library (чтобы TS не ругался)
interface OpenLibraryDoc {
  key: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
}

interface SearchResponse {
  docs: OpenLibraryDoc[];
  numFound: number;
}

export async function searchBooks(query: string, page: number, signal: AbortSignal) {
  const params = new URLSearchParams({ 
    q: query, 
    page: String(page), 
    limit: '20' 
  });
  
  const data = await fetchJson<SearchResponse>(`/search.json?${params}`, { signal });

  const books: Book[] = data.docs.map(doc => ({
    id: doc.key,
    title: doc.title || 'Без названия',
    author: doc.author_name ? doc.author_name.join(', ') : 'Неизвестный автор',
    year: doc.first_publish_year || '—',
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    available: Math.random() > 0.2,
  }));

  return {
    books,
    totalFound: data.numFound || 0,
    totalPages: Math.ceil((data.numFound || 0) / 20)
  };
}