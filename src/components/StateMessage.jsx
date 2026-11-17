export default function StateMessage({ kind, title, children }) {
  const icon = kind === 'error' ? '!' : kind === 'loading' ? '◌' : '✳'
  return (
    <div className={`state-message state-message--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <span className="state-message__icon" aria-hidden="true">{icon}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  )
}
