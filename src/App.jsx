import { Link, Route, Routes } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage.jsx'
import BookDetailPage from './pages/BookDetailPage.jsx'
import StateMessage from './components/StateMessage.jsx'
import ReadingListPage from './pages/ReadingListPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LibrarianRoute from './components/LibrarianRoute.jsx'
import { useAuth } from './hooks/useAuth.js'
import { useReadingList } from './hooks/useReadingList.js'
import AdminBooksPage from './pages/admin/AdminBooksPage.jsx'
import AdminBorrowRequestsPage from './pages/admin/AdminBorrowRequestsPage.jsx'
import AdminBookingsPage from './pages/admin/AdminBookingsPage.jsx'
import './catalog.css'
import './features.css'

function App() {
  const { isAuthenticated, status, user, logout } = useAuth()
  const { readingList } = useReadingList()
  const isLibrarian = String(user?.role || '').toLowerCase() === 'librarian'
    || (Array.isArray(user?.roles) && user.roles.some((role) => String(role).toLowerCase() === 'librarian'))

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Open Shelf home"><span className="brand__mark">O</span><span>open shelf<small>INDEPENDENT LIBRARY</small></span></Link>
        <nav className="header-nav" aria-label="Main navigation"><Link to="/">The collection</Link><Link to="/reading-list">Reading list <span className="nav-count">{readingList.length}</span></Link><Link to="/booking">Book a space</Link>{isLibrarian && <Link to="/admin/books">Admin</Link>}</nav>
        <div className="header-account">
          {status === 'checking' ? <span className="header-note">Checking account…</span> : isAuthenticated ? <><span className="header-note">Hello, {user?.name || user?.firstName || user?.email || 'reader'}</span><button className="nav-action" type="button" onClick={logout}>Sign out</button></> : <><Link className="header-note" to="/login">Log in</Link><Link className="header-signup" to="/register">Join us <span aria-hidden="true">↗</span></Link></>}
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/reading-list" element={<ReadingListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/admin/books" element={<LibrarianRoute><AdminBooksPage /></LibrarianRoute>} />
          <Route path="/admin/borrow-requests" element={<LibrarianRoute><AdminBorrowRequestsPage /></LibrarianRoute>} />
          <Route path="/admin/bookings" element={<LibrarianRoute><AdminBookingsPage /></LibrarianRoute>} />
          <Route path="*" element={<section className="detail-state"><StateMessage kind="empty" title="This page is a blank page">We couldn’t find what you were looking for.</StateMessage><Link className="text-link" to="/">← Back to the catalog</Link></section>} />
        </Routes>
      </main>

      <footer className="site-footer" id="about">
        <Link className="brand brand--footer" to="/"><span className="brand__mark">O</span><span>open shelf<small>INDEPENDENT LIBRARY</small></span></Link>
        <p>A quiet place for loud ideas, faraway worlds, and one-more-chapter nights.</p>
        <span className="footer-seal">Read widely <span aria-hidden="true">✳</span> Stay curious</span>
      </footer>
    </div>
  )
}

export default App
