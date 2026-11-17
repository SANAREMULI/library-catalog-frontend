import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard.jsx'
import GenreFilter from '../components/GenreFilter.jsx'
import SearchBar from '../components/SearchBar.jsx'
import StateMessage from '../components/StateMessage.jsx'
import { useBooks } from '../hooks/useBooks.js'
import { useGenres } from '../hooks/useGenres.js'

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const genre = searchParams.get('genre') || ''
  const search = searchParams.get('search') || ''
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1)
  const { books, loading, error, totalPages } = useBooks({ genre, search, page })
  const { genres, loading: genresLoading, error: genresError } = useGenres()

  const updateQuery = useCallback((key, value) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      return next
    })
  }, [setSearchParams])

  const handleSearch = useCallback((value) => updateQuery('search', value), [updateQuery])
  const handleGenre = useCallback((value) => updateQuery('genre', value), [updateQuery])

  return (
    <>
      <section className="catalog-intro">
        <p className="eyebrow"><span /> A little something for every reader</p>
        <h1>Find your next<br /><em>favorite chapter.</em></h1>
        <p className="catalog-intro__copy">Wander through stories, ideas, and worlds waiting to be discovered.</p>
        <div className="catalog-intro__stamp" aria-hidden="true"><span>THE</span><strong>OPEN<br />SHELF</strong><i>✳</i></div>
      </section>

      <section className="catalog-section" aria-labelledby="catalog-heading">
        <div className="catalog-toolbar">
          <div className="catalog-toolbar__heading">
            <p className="eyebrow">Curated for curious minds</p>
            <h2 id="catalog-heading">The collection <span aria-hidden="true">↘</span></h2>
          </div>
          <div className="catalog-controls">
            <SearchBar key={search} value={search} onSearch={handleSearch} />
            <GenreFilter genres={genres} value={genre} onChange={handleGenre} loading={genresLoading} error={genresError} />
          </div>
        </div>

        {(search || genre) && (
          <div className="active-filters" aria-live="polite">
            Showing {search ? <strong>“{search}”</strong> : 'all titles'}{genre ? <> in <strong>{genre}</strong></> : ''}
            <button type="button" onClick={() => setSearchParams({})}>Clear filters <span aria-hidden="true">×</span></button>
          </div>
        )}

        {loading ? (
          <StateMessage kind="loading" title="Turning the pages…">Your books are on their way.</StateMessage>
        ) : error ? (
          <StateMessage kind="error" title="The shelves are out of reach">{error} Check your API connection and try again.</StateMessage>
        ) : books.length === 0 ? (
          <StateMessage kind="empty" title="No books found">Try a different title, author, or genre and we’ll look again.</StateMessage>
        ) : (
          <>
            <p className="results-count">{books.length} {books.length === 1 ? 'book' : 'books'} to explore</p>
            <div className="book-grid">
              {books.map((book, index) => <BookCard key={book.id ?? book._id ?? `${book.title}-${index}`} book={book} />)}
            </div>
            {totalPages > 1 && (
              <nav className="pagination" aria-label="Catalog pages">
                <button type="button" disabled={page <= 1} onClick={() => setSearchParams((current) => { const next = new URLSearchParams(current); next.set('page', String(page - 1)); return next })}>← Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button type="button" disabled={page >= totalPages} onClick={() => setSearchParams((current) => { const next = new URLSearchParams(current); next.set('page', String(page + 1)); return next })}>Next →</button>
              </nav>
            )}
          </>
        )}
      </section>
    </>
  )
}
