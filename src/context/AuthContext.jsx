import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiGet } from '../lib/api.js'
import { AuthContext } from './authContextValue.js'

const TOKEN_KEY = 'open-shelf-auth-token'

function removeSavedToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Cookie-based sessions remain usable when browser storage is unavailable.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    const controller = new AbortController()
    apiGet('/api/users/profile', controller.signal)
      .then((payload) => {
        const profile = payload?.user ?? payload?.data?.user ?? payload?.data ?? payload
        setUser(profile)
        setStatus('authenticated')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          removeSavedToken()
          setUser(null)
          setStatus('unauthenticated')
        }
      })
    return () => controller.abort()
  }, [])

  const acceptSession = useCallback((profile, token) => {
    if (token) {
      try {
        window.localStorage.setItem(TOKEN_KEY, token)
      } catch {
        // The API may also establish a cookie-based session.
      }
    }
    setUser(profile || { email: 'Patron' })
    setStatus('authenticated')
  }, [])

  const logout = useCallback(() => {
    removeSavedToken()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const value = useMemo(() => ({
    user,
    status,
    isAuthenticated: status === 'authenticated',
    acceptSession,
    logout,
  }), [user, status, acceptSession, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
