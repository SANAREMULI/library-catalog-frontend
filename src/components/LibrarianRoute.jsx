import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import StateMessage from './StateMessage.jsx'

export default function LibrarianRoute({ children }) {
  const { status, isAuthenticated, user } = useAuth()
  const location = useLocation()
  if (status === 'checking') return <StateMessage kind="loading" title="Checking your account…">One moment, please.</StateMessage>
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />

  const roles = Array.isArray(user?.roles) ? user.roles : []
  const isLibrarian = String(user?.role || '').toLowerCase() === 'librarian'
    || roles.some((role) => String(role).toLowerCase() === 'librarian')
  if (!isLibrarian) {
    return <section className="detail-state"><StateMessage kind="error" title="Librarian access required">Your account does not have permission to open this page.</StateMessage></section>
  }
  return children
}
