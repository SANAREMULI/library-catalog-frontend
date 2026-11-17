import { useState } from 'react'
import { apiPost, getApiErrorMessage } from '../lib/api.js'

export default function BorrowRequestAction({ book }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const availableCopies = Number(book?.availableCopies ?? book?.copiesAvailable ?? 1)

  async function requestBook() {
    setError('')
    setMessage('')
    setSubmitting(true)
    try {
      await apiPost('/api/borrow-requests', { bookId: book.id ?? book._id ?? book.bookId })
      setMessage('Borrow request sent.')
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not send this borrow request.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="borrow-request-action">
      <button className="button button--dark" type="button" disabled={submitting || availableCopies <= 0} onClick={requestBook}>
        {submitting ? 'Sending request…' : availableCopies <= 0 ? 'Currently unavailable' : 'Request to borrow'} <span aria-hidden="true">↗</span>
      </button>
      {message && <p className="form-success" role="status">{message}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  )
}
