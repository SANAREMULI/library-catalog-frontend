import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StateMessage from '../components/StateMessage.jsx'
import { apiGet, getBookId, getCoverUrl } from '../lib/api.js'
import { useReadingList } from '../hooks/useReadingList.js'

export default function BookDetailPage() {
  const { id } = useParams()
  const [detail, setDetail] = useState({ id: null, book: null, error: '' })
  const [failedCoverId, setFailedCoverId] = useState(null)
  const loading = detail.id !== id
  const book = loading ? null : detail.book
  const error = loading ? '' : detail.error
  const coverFailed = failedCoverId === id
  const { readingList, addBook, removeBook } = useReadingList()

  useEffect(() => {
    const controller = new AbortController()
    apiGet(`/books/${encodeURIComponent(id)}`, controller.signal)
      .then((payload) => {
        const result = payload?.book ?? payload?.data ?? payload
        if (!result || typeof result !== 'object' || (!getBookId(result) && !result.title)) {
          throw new Error('This book could not be found. The link may be incorrect or the book may have been removed.')
        }
        setDetail({ id, book: result, error: '' })
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setDetail({ id, book: null, error: requestError.message || 'Unable to load this book.' })
        }
      })
    return () => controller.abort()
  }, [id])

  if (loading) return <StateMessage kind="loading" title="Finding this story…">One moment while we fetch the details.</StateMessage>
  if (error) return <section className="detail-state"><StateMessage kind="error" title="We couldn’t find that book">{error}</StateMessage><Link className="text-link" to="/">← Back to the catalog</Link></section>

  const cover = getCoverUrl(book)
  const title = book.title || 'Untitled book'
  const author = book.author || book.authors || 'Unknown author'
  const description = book.description || book.summary || 'There is no description for this title yet. Pick it up and discover the story for yourself.'
  const isSaved = readingList.some((item) => String(getBookId(item)) === String(getBookId(book)))

  return (
    <section className="book-detail">
      <Link className="back-link" to="/">← Back to all books</Link>
      <div className="book-detail__layout">
        <div className="book-detail__cover-frame">
            {cover && !coverFailed ? <img src={cover} alt={`Cover of ${title}`} onError={() => setFailedCoverId(id)} /> : <div className="book-cover-fallback book-cover-fallback--large"><span className="book-cover-fallback__ornament">✳</span><span className="book-cover-fallback__title">{title}</span><span className="book-cover-fallback__author">{author}</span></div>}
        </div>
        <div className="book-detail__content">
          <p className="eyebrow"><span /> {book.genre || 'From the collection'}</p>
          <h1>{title}</h1>
          <p className="book-detail__author">by <strong>{author}</strong></p>
          <div className="detail-rule" />
          <p className="book-detail__description">{description}</p>
          <dl className="book-facts">
            {(book.genre || book.category) && <div><dt>Genre</dt><dd>{book.genre || book.category}</dd></div>}
            {book.isbn && <div><dt>ISBN</dt><dd>{book.isbn}</dd></div>}
            {book.publishedYear && <div><dt>Published</dt><dd>{book.publishedYear}</dd></div>}
            {book.publisher && <div><dt>Publisher</dt><dd>{book.publisher}</dd></div>}
            {book.pages && <div><dt>Pages</dt><dd>{book.pages}</dd></div>}
          </dl>
          <Link className="button button--dark" to="/">Keep exploring <span aria-hidden="true">↗</span></Link>
          <button className={`reading-toggle reading-toggle--detail${isSaved ? ' is-saved' : ''}`} type="button" onClick={() => isSaved ? removeBook(getBookId(book)) : addBook(book)} aria-pressed={isSaved}>
            <span aria-hidden="true">{isSaved ? '✓' : '+'}</span> {isSaved ? 'Saved to your reading list' : 'Add to my reading list'}
          </button>
        </div>
      </div>
    </section>
  )
}
