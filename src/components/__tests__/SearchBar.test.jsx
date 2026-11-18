import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SearchBar from '../SearchBar.jsx'

describe('SearchBar', () => {
  it('calls onSearch with the entered query after the debounce', () => {
    vi.useFakeTimers()
    const onSearch = vi.fn()

    render(<SearchBar value="" onSearch={onSearch} />)
    fireEvent.change(screen.getByRole('searchbox', { name: /search by title or author/i }), {
      target: { value: 'Dune' },
    })
    vi.advanceTimersByTime(350)

    expect(onSearch).toHaveBeenCalledWith('Dune')
    vi.useRealTimers()
  })

  it('clears the search field from the clear action', async () => {
    const user = userEvent.setup()
    render(<SearchBar value="Dune" onSearch={vi.fn()} />)

    const input = screen.getByRole('searchbox', { name: /search by title or author/i })
    await user.click(screen.getByRole('button', { name: /clear search/i }))

    expect(input).toHaveValue('')
  })
})
