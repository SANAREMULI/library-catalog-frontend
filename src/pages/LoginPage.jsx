import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { apiPost, getApiErrorMessage } from '../lib/api.js'
import StateMessage from '../components/StateMessage.jsx'

function getSession(payload) {
  const data = payload?.data ?? payload
  const user = data?.user ?? data?.profile ?? data
  return {
    user: user?.username && !user?.name ? { ...user, name: user.username } : user,
    token: data?.token ?? data?.accessToken ?? data?.access_token ?? payload?.token,
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, status, acceptSession } = useAuth()
  const destination = location.state?.from?.pathname || '/booking'

  useEffect(() => {
    if (status === 'authenticated') navigate(destination, { replace: true })
  }, [status, destination, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = await apiPost('/api/auth/login', { email: email.trim(), password })
      const session = getSession(payload)
      acceptSession(session.user, session.token)
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'We could not sign you in. Check your details and try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'checking') return <StateMessage kind="loading" title="Checking your account…">One moment, please.</StateMessage>
  if (isAuthenticated) return null

  return (
    <section className="auth-layout">
      <div className="auth-aside"><p className="eyebrow"><span /> Welcome back</p><h1>Your next chapter<br /><em>starts here.</em></h1><p>Sign in to keep your reading list close and reserve a quiet spot to read.</p><span className="auth-aside__seal" aria-hidden="true">OPEN<br />SHELF <i>✳</i></span></div>
      <div className="auth-panel">
        <p className="eyebrow">Reader account</p><h2>Log in</h2><p className="auth-panel__intro">Pick up right where you left off.</p>
        {location.state?.message && <p className="form-success" role="status">{location.state.message}</p>}
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>Email address<input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
          <label>Password<input type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button--dark form-submit" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">↗</span></button>
        </form>
        <p className="auth-switch">New around here? <Link to="/register" state={location.state}>Create an account</Link></p>
      </div>
    </section>
  )
}
