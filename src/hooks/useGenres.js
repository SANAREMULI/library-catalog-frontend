import { useEffect, useState } from 'react'
import { apiGet, getList } from '../lib/api.js'

export function useGenres() {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    apiGet('/genres', controller.signal)
      .then((payload) => {
        const values = getList(payload, ['genres', 'data', 'items', 'results'])
          .map((genre) => typeof genre === 'string' ? genre : genre?.name ?? genre?.genre)
          .filter(Boolean)
        setGenres([...new Set(values)])
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Unable to load genres.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  return { genres, loading, error }
}
