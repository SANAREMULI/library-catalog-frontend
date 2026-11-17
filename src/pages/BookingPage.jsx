import BookingForm from '../components/BookingForm.jsx'

export default function BookingPage() {
  return (
    <section className="booking-layout">
      <div className="booking-intro"><p className="eyebrow"><span /> Your reading corner awaits</p><h1>Save yourself<br /><em>a little space.</em></h1><p>Choose a spot and a time for your next visit. The server checks availability before confirming your reservation.</p><div className="booking-aside-note"><span aria-hidden="true">✳</span><p>Bring your current read, or find a new one when you arrive.</p></div></div>
      <div className="booking-panel"><p className="eyebrow">Plan a visit</p><h2>Space booking</h2><BookingForm /></div>
    </section>
  )
}
