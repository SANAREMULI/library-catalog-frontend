import { useEffect, useState } from 'react'
import { apiGet, getList } from '../lib/api.js'

export function useBooks({ genre, search, page }) {
  const queryKey = JSON.stringify({ genre, search, page })
  const [result, setResult] = useState({ queryKey: '', books: [], error: '', totalPages: 1 })

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams()
    if (genre) params.set('genre', genre)
    if (search) params.set('search', search)
    params.set('page', String(page))

    apiGet(`/books?${params.toString()}`, controller.signal)
      .then((payload) => {
        const books = getList(payload, ['books', 'data', 'items', 'results'])
        const reportedPages = Number(payload?.totalPages ?? payload?.pagination?.totalPages ?? 1)
        setResult({ queryKey, books, error: '', totalPages: Number.isFinite(reportedPages) && reportedPages > 0 ? reportedPages : 1 })
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setResult({ queryKey, books: [], error: requestError.message || 'Unable to load books.', totalPages: 1 })
        }
      })

    return () => controller.abort()
  }, [genre, search, page, queryKey])

  const isCurrentQuery = result.queryKey === queryKey
  return {
    books: isCurrentQuery ? result.books : [],
    loading: !isCurrentQuery,
    error: isCurrentQuery ? result.error : '',
    totalPages: isCurrentQuery ? result.totalPages : 1,
  }
}
