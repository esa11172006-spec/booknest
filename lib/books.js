export function filterBooks(books, { query, genre, onlyAvailable }) {
  const q = query.trim().toLowerCase();
  return books.filter(book => {
    const matchesQuery = !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q);
    const matchesGenre = !genre || book.genre === genre;
    const matchesAvailable = !onlyAvailable || book.available;
    return matchesQuery && matchesGenre && matchesAvailable;
  });
}

export function sortBooks(books, sortBy) {
  const copy = [...books]; 
  switch (sortBy) {
    case 'title': return copy.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    case 'year': return copy.sort((a, b) => b.year - a.year);
    case 'rating': return copy.sort((a, b) => b.rating - a.rating);
    default: return copy;
  }
}

export function getVisibleBooks(books, filters) {
  const filtered = filterBooks(books, filters);
  return sortBooks(filtered, filters.sortBy);
}