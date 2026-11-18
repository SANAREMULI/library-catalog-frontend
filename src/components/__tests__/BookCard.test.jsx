import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BookCard from '../BookCard.jsx'

const addBook = vi.fn()
const removeBook = vi.fn()

vi.mock('../../hooks/useReadingList.js', () => ({
  useReadingList: () => ({
    readingList: [],
    addBook,
    removeBook,
  }),
}))

describe('BookCard', () => {
  beforeEach(() => {
    addBook.mockClear()
    removeBook.mockClear()
  })

  it('renders the book title, author, and genre', () => {
    render(
      <MemoryRouter>
        <BookCard
          book={{
            id: 'book-1',
            title: 'Dune',
            author: 'Frank Herbert',
            genre: { name: 'Science Fiction' },
          }}
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Dune' })).toBeInTheDocument()
    expect(screen.getAllByText('Frank Herbert').length).toBeGreaterThan(0)
    expect(screen.getByText('Science Fiction')).toBeInTheDocument()
  })

  it('offers an accessible save-for-later action', () => {
    render(
      <MemoryRouter>
        <BookCard book={{ id: 'book-2', title: 'Beloved', author: 'Toni Morrison' }} />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: /save for later/i })).toHaveAttribute('aria-pressed', 'false')
  })
})
