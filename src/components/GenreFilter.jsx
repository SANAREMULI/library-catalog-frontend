export default function GenreFilter({ genres, value, onChange, loading, error }) {
  return (
    <div className="filter-control">
      <label htmlFor="genre-filter">Browse by genre</label>
      <select id="genre-filter" value={value} onChange={(event) => onChange(event.target.value)} disabled={loading && genres.length === 0}>
        <option value="">All genres</option>
        {genres.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
      </select>
      {loading && <span className="control-note" role="status">Loading genres…</span>}
      {error && <span className="control-note control-note--error" role="status">Genres unavailable: {error}</span>}
    </div>
  )
}
