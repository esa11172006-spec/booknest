import type { Book } from '../types';
import { BookCard } from './BookCard';

interface BookListProps {
  books: Book[];
  wishlist: Book[];
  onToggleWishlist: (book: Book) => void;
}

export function BookList({ books, wishlist, onToggleWishlist }: BookListProps) {
  if (books.length === 0) return null;

  return (
    <div className="catalog-grid">
      {books.map(book => (
        <BookCard 
          key={book.id} 
          book={book} 
          isWishlisted={wishlist.some(b => b.id === book.id)}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
}