import { useState, useEffect, useCallback } from 'react';
import { searchBooks } from './api/books';
import { FiltersPanel } from './components/FiltersPanel';
import { BookList } from './components/BookList';
import { ApiError } from './api/client';
import type { Book, Status } from './types';
import './App.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errorStatus, setErrorStatus] = useState(0);
  
  const [wishlist, setWishlist] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('booknest_wishlist_v1');
      return saved ? JSON.parse(saved) : [];
    } catch { 
      return []; 
    }
  });

  useEffect(() => {
    localStorage.setItem('booknest_wishlist_v1', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (query.length < 3) {
      setStatus('empty');
      setBooks([]);
      return;
    }

    const controller = new AbortController();
    setStatus('loading');

    const timer = setTimeout(async () => {
      try {
        const res = await searchBooks(query, page, controller.signal);
        setBooks(res.books);
        setTotalPages(res.totalPages);
        setStatus(res.books.length === 0 ? 'empty' : 'success');
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setStatus('error');
          setErrorStatus(err instanceof ApiError ? err.status : 0);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, page]);

  const handleQueryChange = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  const handleToggleWishlist = useCallback((book: Book) => {
    setWishlist((prev) => {
      const exists = prev.some((b) => b.id === book.id);
      return exists ? prev.filter((b) => b.id !== book.id) : [...prev, book];
    });
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>BookNest</h1>
        <div>Мой список: {wishlist.length}</div>
      </header>

      <main className="main">
        <FiltersPanel query={query} onQueryChange={handleQueryChange} />

        {status === 'loading' && <div className="state-msg">Загрузка...</div>}
        
        {status === 'error' && (
          <div className="state-msg error">
            {errorStatus === 0 ? 'Нет интернета' : 'Ошибка сервера'} 
            <button onClick={() => setPage((p) => p)}>Повторить</button>
          </div>
        )}
        
        {status === 'empty' && <div className="state-msg">Ничего не найдено</div>}

        {status === 'success' && (
          <>
            <BookList 
              books={books} 
              wishlist={wishlist} 
              onToggleWishlist={handleToggleWishlist} 
            />
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Назад</button>
              <span>Стр. {page} из {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Вперед</button>
            </div>
          </>
        )}

        <h2>Мой список желаемого</h2>
        <BookList 
          books={wishlist} 
          wishlist={wishlist} 
          onToggleWishlist={handleToggleWishlist} 
        />
      </main>
    </div>
  );
}