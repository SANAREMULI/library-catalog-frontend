import { Link, Route, Routes } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage.jsx'
import BookDetailPage from './pages/BookDetailPage.jsx'
import StateMessage from './components/StateMessage.jsx'
import './catalog.css'

function App() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Open Shelf home"><span className="brand__mark">O</span><span>open shelf<small>INDEPENDENT LIBRARY</small></span></Link>
        <nav className="header-nav" aria-label="Main navigation"><Link to="/">The collection</Link><a href="#about">Our little corner</a></nav>
        <a className="header-note" href="#about">Made for the love of reading <span aria-hidden="true">↗</span></a>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
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
