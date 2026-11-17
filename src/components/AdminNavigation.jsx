import { NavLink } from 'react-router-dom'

export default function AdminNavigation() {
  return <nav className="admin-navigation" aria-label="Librarian pages"><NavLink to="/admin/books">Books</NavLink><NavLink to="/admin/borrow-requests">Borrow requests</NavLink><NavLink to="/admin/bookings">Space bookings</NavLink></nav>
}
