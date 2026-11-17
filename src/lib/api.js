const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')

export async function apiGet(path, signal) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(detail || `Request failed (${response.status})`)
  }

  return response.json()
}

export function getList(payload, keys = []) {
  if (Array.isArray(payload)) return payload
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key]
  }
  return []
}

export function getBookId(book) {
  return book?.id ?? book?._id ?? book?.bookId
}

export function getCoverUrl(book) {
  return book?.coverImage || book?.coverUrl || book?.imageUrl || book?.cover || ''
}
