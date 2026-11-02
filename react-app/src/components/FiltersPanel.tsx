interface FiltersPanelProps {
  query: string;
  onQueryChange: (q: string) => void;
}

export function FiltersPanel({ query, onQueryChange }: FiltersPanelProps) {
  return (
    <form className="filters-form" onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend>Поиск книг</legend>
        <div className="form-group">
          <label htmlFor="search">Введите название (мин. 3 символа)</label>
          <input 
            type="search" 
            id="search" 
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Например: Javascript"
          />
        </div>
      </fieldset>
    </form>
  );
}