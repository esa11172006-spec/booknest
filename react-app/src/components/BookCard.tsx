import type { Book } from '../types';
import { Badge } from './Badge';

interface BookCardProps {
  book: Book;
  isWishlisted: boolean;
  onToggleWishlist: (book: Book) => void;
}

export function BookCard({ book, isWishlisted, onToggleWishlist }: BookCardProps) {
  return (
    <article className="card">
      <h3 className="card__title">{book.title}</h3>
      <p className="card__author">{book.author}</p>
      
      <div className="card__badges">
        <Badge type="rating">★ {book.rating}</Badge>
        <Badge type={book.available ? 'available' : 'unavailable'}>
          {book.available ? 'В наличии' : 'Нет в наличии'}
        </Badge>
      </div>

      <button 
        className={`button ${isWishlisted ? 'button--active' : ''}`}
        onClick={() => onToggleWishlist(book)}
        aria-pressed={isWishlisted}
      >
        {isWishlisted ? 'В списке' : 'Хочу прочитать'}
      </button>
    </article>
  );
}