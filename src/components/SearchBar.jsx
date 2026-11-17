import { useEffect, useRef, useState } from 'react'

export default function SearchBar({ value, onSearch }) {
  const [input, setInput] = useState(value)
  const lastSearch = useRef(value)

  useEffect(() => {
    const query = input.trim()
    if (query === lastSearch.current) {
      return undefined
    }
    const timeout = window.setTimeout(() => {
      lastSearch.current = query
      onSearch(query)
    }, 350)
    return () => window.clearTimeout(timeout)
  }, [input, onSearch])

  return (
    <div className="search-control">
      <label className="sr-only" htmlFor="catalog-search">Search by title or author</label>
      <span className="search-control__icon" aria-hidden="true">⌕</span>
      <input
        id="catalog-search"
        type="search"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Search titles or authors"
        autoComplete="off"
      />
      {input && <button className="search-control__clear" type="button" onClick={() => setInput('')} aria-label="Clear search">×</button>}
    </div>
  )
}
