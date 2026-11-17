import { Link } from 'react-router-dom'
import BookCard from '../components/BookCard.jsx'
import StateMessage from '../components/StateMessage.jsx'
import { useReadingList } from '../hooks/useReadingList.js'
import BorrowRequestAction from '../components/BorrowRequestAction.jsx'
import { getBookId } from '../lib/api.js'

export default function ReadingListPage() {
  const { readingList, clearList } = useReadingList()

  return (
    <section className="reading-list-page">
      <div className="reading-list-heading"><div><p className="eyebrow"><span /> Saved for later</p><h1>Your reading<br /><em>list.</em></h1><p className="catalog-intro__copy">A little shelf for the books you can't wait to open.</p></div><div className="reading-list-count"><strong>{readingList.length}</strong><span>{readingList.length === 1 ? 'book saved' : 'books saved'}</span></div></div>
      {readingList.length === 0 ? <><StateMessage kind="empty" title="Your list is waiting for a story">Save a book from the catalog and it will be right here, even after a refresh.</StateMessage><div className="reading-list-empty-action"><Link className="button button--dark" to="/">Find a book <span aria-hidden="true">↗</span></Link></div></> : <><div className="reading-list-actions"><p>Stored on this device so your list stays with you.</p><button className="clear-list-button" type="button" onClick={clearList}>Clear the list</button></div><div className="book-grid">{readingList.map((book, index) => <div className="reading-book-item" key={getBookId(book) ?? `${book.title}-${index}`}><BookCard book={book} /><BorrowRequestAction book={book} /></div>)}</div></>}
    </section>
  )
}
