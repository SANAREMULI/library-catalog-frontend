import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { apiPost, getApiErrorMessage } from '../lib/api.js'
import StateMessage from '../components/StateMessage.jsx'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, status, acceptSession } = useAuth()

  useEffect(() => {
    if (status === 'authenticated') navigate('/booking', { replace: true })
  }, [status, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = await apiPost('/api/auth/register', { name: name.trim(), email: email.trim(), password })
      const data = payload?.data ?? payload
      const token = data?.token ?? data?.accessToken ?? data?.access_token ?? payload?.token
      const user = data?.user ?? data?.profile ?? data
      if (token) {
        acceptSession(user, token)
        navigate(location.state?.from?.pathname || '/booking', { replace: true })
      } else {
        navigate('/login', { replace: true, state: { ...location.state, message: 'Your account is ready. Sign in to continue.' } })
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'We could not create your account. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'checking') return <StateMessage kind="loading" title="Checking your account…">One moment, please.</StateMessage>
  if (isAuthenticated) return null

  return (
    <section className="auth-layout auth-layout--register">
      <div className="auth-aside"><p className="eyebrow"><span /> A place on the shelf</p><h1>Make room for<br /><em>good stories.</em></h1><p>Create your reader account to save books and plan your next visit.</p><span className="auth-aside__seal" aria-hidden="true">READ<br />WIDELY <i>✳</i></span></div>
      <div className="auth-panel">
        <p className="eyebrow">Join the community</p><h2>Create account</h2><p className="auth-panel__intro">A few details and you're in.</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>Name<input type="text" name="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required /></label>
          <label>Email address<input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
          <label>Password<input type="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength="8" required /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button--dark form-submit" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create my account'} <span aria-hidden="true">↗</span></button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login" state={location.state}>Log in</Link></p>
      </div>
    </section>
  )
}
