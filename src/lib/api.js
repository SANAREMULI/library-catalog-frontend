const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')

function getToken() {
  try {
    return window.localStorage.getItem('open-shelf-auth-token')
  } catch {
    return null
  }
}

function resolvePath(path) {
  if (API_BASE_URL.endsWith('/api') && path.startsWith('/api/')) {
    return `${API_BASE_URL}${path.slice(4)}`
  }
  return `${API_BASE_URL}${path}`
}

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (typeof error === 'string' && error) return error
  return error?.message || error?.error || error?.detail || error?.data?.message || fallback
}

export async function apiRequest(path, { method = 'GET', body, signal } = {}) {
  const token = getToken()
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(path, {
    method,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  })

  let payload = null
  const responseText = await response.text().catch(() => '')
  if (responseText) {
    try {
      payload = JSON.parse(responseText)
    } catch {
      payload = responseText
    }
  }

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload, `Request failed (${response.status})`))
  }

  return payload
}

export function apiGet(path, signal) {
  return apiRequest(resolvePath(path), { signal })
}

export function apiPost(path, body, signal) {
  return apiRequest(resolvePath(path), { method: 'POST', body, signal })
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
