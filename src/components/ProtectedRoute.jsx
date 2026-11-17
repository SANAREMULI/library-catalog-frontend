import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import StateMessage from './StateMessage.jsx'

export default function ProtectedRoute({ children }) {
  const { status, isAuthenticated } = useAuth()
  const location = useLocation()

  if (status === 'checking') {
    return <StateMessage kind="loading" title="Checking your account…">One moment, please.</StateMessage>
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}
