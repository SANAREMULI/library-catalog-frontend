import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getBookId, getCoverUrl } from '../lib/api.js'

export default function BookCard({ book }) {
  const [coverFailed, setCoverFailed] = useState(false)
  const id = getBookId(book)
  const title = book?.title || 'Untitled book'
  const author = book?.author || book?.authors || 'Unknown author'
  const genre = book?.genre || 'Uncategorized'
  const cover = getCoverUrl(book)

  return (
    <article className="book-card">
      <Link className="book-card__link" to={`/books/${encodeURIComponent(id)}`} aria-label={`View ${title}`}>
        <div className="book-card__cover-wrap">
          {cover && !coverFailed ? (
            <img className="book-card__cover" src={cover} alt={`Cover of ${title}`} loading="lazy" onError={() => setCoverFailed(true)} />
          ) : (
            <div className="book-cover-fallback" aria-label="No cover available">
              <span className="book-cover-fallback__ornament">✳</span>
              <span className="book-cover-fallback__title">{title}</span>
              <span className="book-cover-fallback__author">{author}</span>
            </div>
          )}
          <span className="book-card__genre">{genre}</span>
        </div>
        <div className="book-card__info">
          <h3>{title}</h3>
          <p>{author}</p>
          <span className="book-card__read">Explore book <span aria-hidden="true">↗</span></span>
        </div>
      </Link>
    </article>
  )
}
