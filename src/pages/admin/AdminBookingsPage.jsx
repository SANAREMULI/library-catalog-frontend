import { useCallback, useEffect, useState } from 'react'
import StateMessage from '../../components/StateMessage.jsx'
import AdminNavigation from '../../components/AdminNavigation.jsx'
import { apiRequest, getApiErrorMessage, getList } from '../../lib/api.js'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBookings = useCallback(async () => {
    try {
      const payload = await apiRequest('/api/bookings')
      setBookings(getList(payload, ['bookings', 'data', 'items', 'results']))
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not load space bookings.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(loadBookings, 0)
    return () => window.clearTimeout(timer)
  }, [loadBookings])

  function refreshBookings() {
    setLoading(true)
    setError('')
    loadBookings()
  }

  return <section className="admin-page"><div className="admin-heading"><div><p className="eyebrow"><span /> Librarian desk</p><h1>Space <em>bookings.</em></h1><p>All patron reservations in one place.</p></div><button className="clear-list-button" type="button" onClick={refreshBookings}>Refresh list</button></div><AdminNavigation />{loading ? <StateMessage kind="loading" title="Loading bookings…" /> : error ? <StateMessage kind="error" title="Could not load bookings">{error}</StateMessage> : bookings.length === 0 ? <StateMessage kind="empty" title="No space bookings yet">New reservations will appear here.</StateMessage> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Space</th><th>Patron</th><th>Date</th><th>Start</th><th>End</th></tr></thead><tbody>{bookings.map((booking, index) => <tr key={booking.id ?? booking._id ?? index}><td>{booking.space?.name || booking.space || '—'}</td><td>{booking.user?.name || booking.user?.email || '—'}</td><td>{booking.date ? new Date(booking.date).toLocaleDateString() : '—'}</td><td>{booking.startTime || '—'}</td><td>{booking.endTime || '—'}</td></tr>)}</tbody></table></div>}</section>
}
