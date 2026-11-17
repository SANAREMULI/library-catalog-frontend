import { useCallback, useEffect, useState } from 'react'
import StateMessage from '../../components/StateMessage.jsx'
import AdminNavigation from '../../components/AdminNavigation.jsx'
import { apiRequest, getApiErrorMessage, getList } from '../../lib/api.js'

const statuses = ['pending', 'approved', 'returned', 'late']

export default function AdminBorrowRequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [updating, setUpdating] = useState('')

  const loadRequests = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const payload = await apiRequest('/api/borrow-requests')
      setRequests(getList(payload, ['borrowRequests', 'requests', 'data', 'items', 'results']))
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not load borrow requests.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // The request helper intentionally marks this initial fetch as loading.
    // oxlint-disable-next-line react(set-state-in-effect)
    loadRequests()
  }, [loadRequests])

  async function updateStatus(request, status) {
    const id = request.id ?? request._id
    setUpdating(String(id))
    setError('')
    setNotice('')
    try {
      await apiRequest(`/api/borrow-requests/${encodeURIComponent(id)}`, { method: 'PATCH', body: { status } })
      setNotice('Request status updated by the server.')
      await loadRequests()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not update this request.'))
    } finally {
      setUpdating('')
    }
  }

  return <section className="admin-page"><div className="admin-heading"><div><p className="eyebrow"><span /> Librarian desk</p><h1>Borrow <em>requests.</em></h1><p>Update request status; the API calculates any return fine.</p></div></div><AdminNavigation />{notice && <p className="form-success" role="status">{notice}</p>}{error && <p className="form-error" role="alert">{error}</p>}{loading ? <StateMessage kind="loading" title="Loading borrow requests…" /> : error && requests.length === 0 ? <StateMessage kind="error" title="Could not load requests">{error}</StateMessage> : requests.length === 0 ? <StateMessage kind="empty" title="No borrow requests yet">Patron requests will appear here.</StateMessage> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Book</th><th>Patron</th><th>Requested</th><th>Due</th><th>Status</th><th>Fine</th></tr></thead><tbody>{requests.map((request, index) => { const id = request.id ?? request._id ?? index; const book = request.book?.title || request.bookTitle || 'Book'; const user = request.user?.name || request.user?.email || request.userName || 'Patron'; return <tr key={id}><td>{book}</td><td>{user}</td><td>{request.requestedAt ? new Date(request.requestedAt).toLocaleDateString() : '—'}</td><td>{request.dueAt ? new Date(request.dueAt).toLocaleDateString() : '—'}</td><td><label className="sr-only" htmlFor={`status-${id}`}>Status for {book}</label><select id={`status-${id}`} value={request.status || 'pending'} disabled={updating === String(id)} onChange={(event) => updateStatus(request, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td><td>{request.fine == null ? '—' : `$${Number(request.fine).toFixed(2)}`}</td></tr> })}</tbody></table></div>}</section>
}
