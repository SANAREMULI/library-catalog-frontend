import { useCallback, useEffect, useState } from 'react'
import StateMessage from '../../components/StateMessage.jsx'
import AdminNavigation from '../../components/AdminNavigation.jsx'
import { apiRequest, getApiErrorMessage, getList, getBookId } from '../../lib/api.js'

const emptyBook = { title: '', author: '', isbn: '', genre: '', totalCopies: '1', availableCopies: '1', coverImage: '', description: '' }

export default function AdminBooksPage() {
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  const loadBooks = useCallback(async () => {
    try {
      const [payload, genrePayload] = await Promise.all([apiRequest('/api/books'), apiRequest('/api/genres')])
      setBooks(getList(payload, ['books', 'data', 'items', 'results']))
      setGenres(getList(genrePayload, ['genres', 'data', 'items', 'results']))
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not load books.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(loadBooks, 0)
    return () => window.clearTimeout(timer)
  }, [loadBooks])

  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function saveBook(event) {
    event.preventDefault()
    setSaving(true)
    setLoading(true)
    setError('')
    setNotice('')
    const { id, ...fields } = form
    const body = { ...fields, totalCopies: Number(fields.totalCopies), availableCopies: Number(fields.availableCopies) }
    try {
      await apiRequest(id ? `/api/books/${encodeURIComponent(id)}` : '/api/books', {
        method: id ? 'PUT' : 'POST', body,
      })
      setForm(null)
      setNotice(id ? 'Book updated.' : 'Book added.')
      await loadBooks()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not save this book.'))
      setLoading(false)
    } finally {
      setSaving(false)
    }
  }

  async function deleteBook(book) {
    const id = book.id ?? book._id ?? book.bookId
    if (!window.confirm(`Delete “${book.title || 'this book'}”?`)) return
    setError('')
    setLoading(true)
    setNotice('')
    try {
      await apiRequest(`/api/books/${encodeURIComponent(id)}`, { method: 'DELETE' })
      setNotice('Book deleted.')
      await loadBooks()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not delete this book.'))
      setLoading(false)
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-heading"><div><p className="eyebrow"><span /> Librarian desk</p><h1>Manage <em>books.</em></h1><p>Keep the catalog and copy counts up to date.</p></div><button className="button button--dark" type="button" onClick={() => setForm({ ...emptyBook })}>＋ Add a book</button></div><AdminNavigation />
      {notice && <p className="form-success" role="status">{notice}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {form && <form className="admin-book-form" onSubmit={saveBook}><h2>{form.id ? 'Edit book' : 'Add a book'}</h2><div className="admin-form-grid">
        <label>Title<input name="title" value={form.title} onChange={updateForm} required /></label><label>Author<input name="author" value={form.author} onChange={updateForm} required /></label><label>ISBN<input name="isbn" value={form.isbn} onChange={updateForm} required /></label><label>Genre<select name="genre" value={form.genre} onChange={updateForm} required><option value="" disabled>Choose a genre</option>{genres.map((genre) => <option key={genre._id} value={genre._id}>{genre.name}</option>)}</select></label><label>Total copies<input name="totalCopies" type="number" min="0" value={form.totalCopies} onChange={updateForm} required /></label><label>Available copies<input name="availableCopies" type="number" min="0" value={form.availableCopies} onChange={updateForm} required /></label><label>Cover image URL<input name="coverImage" type="url" value={form.coverImage} onChange={updateForm} /></label><label className="admin-form-wide">Description<textarea name="description" value={form.description} onChange={updateForm} rows="3" /></label>
      </div><div className="admin-form-actions"><button className="button button--dark" disabled={saving}>{saving ? 'Saving…' : 'Save book'}</button><button className="clear-list-button" type="button" onClick={() => setForm(null)}>Cancel</button></div></form>}
      {loading ? <StateMessage kind="loading" title="Loading the catalog…" /> : error && books.length === 0 ? <StateMessage kind="error" title="Could not load books">{error}</StateMessage> : books.length === 0 ? <StateMessage kind="empty" title="No books in the catalog yet">Add the first book to get started.</StateMessage> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>Available</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{books.map((book, index) => <tr key={getBookId(book) ?? index}><td>{book.title || 'Untitled'}</td><td>{book.author || '—'}</td><td>{book.genre?.name || book.genre || '—'}</td><td>{book.availableCopies ?? book.copiesAvailable ?? 0}</td><td className="admin-row-actions"><button type="button" onClick={() => setForm({ ...emptyBook, ...book, id: getBookId(book), genre: book.genre?._id ?? book.genre ?? '', totalCopies: String(book.totalCopies ?? 0), availableCopies: String(book.availableCopies ?? book.copiesAvailable ?? 0) })}>Edit</button><button type="button" onClick={() => deleteBook(book)}>Delete</button></td></tr>)}</tbody></table></div>}
    </section>
  )
}
