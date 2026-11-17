import { useState } from 'react'
import { apiPost, getApiErrorMessage } from '../lib/api.js'

const spaces = ['Reading Room', 'Quiet Study Desk', 'Community Table', 'Window Nook']

function localDateValue() {
  const date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 10)
}

export default function BookingForm() {
  const [form, setForm] = useState({ space: '', date: '', startTime: '', endTime: '' })
  const [error, setError] = useState('')
  const [savedBooking, setSavedBooking] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
    setSavedBooking(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSavedBooking(null)
    if (form.endTime <= form.startTime) {
      setError('Choose an end time that is later than your start time.')
      return
    }
    setSubmitting(true)
    try {
      await apiPost('/api/bookings', form)
      setSavedBooking({ ...form })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not reserve this time. The space may already be booked.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="booking-form-wrap">
      <form className="form-stack booking-form" onSubmit={handleSubmit}>
        <label htmlFor="booking-space">Choose a space
          <select id="booking-space" name="space" value={form.space} onChange={updateField} required>
            <option value="" disabled>Select a reading spot</option>
            {spaces.map((space) => <option key={space} value={space}>{space}</option>)}
          </select>
        </label>
        <label htmlFor="booking-date">Date<input id="booking-date" type="date" name="date" min={localDateValue()} value={form.date} onChange={updateField} required /></label>
        <div className="booking-time-row">
          <label htmlFor="booking-start">Start time<input id="booking-start" type="time" name="startTime" value={form.startTime} onChange={updateField} required /></label>
          <label htmlFor="booking-end">End time<input id="booking-end" type="time" name="endTime" value={form.endTime} onChange={updateField} required /></label>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button--dark form-submit" type="submit" disabled={submitting}>{submitting ? 'Checking availability…' : 'Reserve this space'} <span aria-hidden="true">↗</span></button>
      </form>
      {savedBooking && <div className="booking-confirmation" role="status"><span className="booking-confirmation__icon" aria-hidden="true">✓</span><div><strong>Your visit is booked</strong><p>{savedBooking.space} · {savedBooking.date} · {savedBooking.startTime}–{savedBooking.endTime}</p><small>The server confirmed the reservation.</small></div></div>}
    </div>
  )
}
