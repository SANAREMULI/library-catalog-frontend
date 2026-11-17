import { useEffect, useMemo, useState } from 'react'
import { getBookId } from '../lib/api.js'
import { ReadingListContext } from './readingListContextValue.js'

const STORAGE_KEY = 'open-shelf-reading-list'
function loadSavedList() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function ReadingListProvider({ children }) {
  const [readingList, setReadingList] = useState(loadSavedList)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(readingList))
    } catch {
      // Keep the in-memory list usable if browser storage is disabled or full.
    }
  }, [readingList])

  const value = useMemo(() => ({
    readingList,
    addBook(book) {
      const id = getBookId(book)
      if (id == null) return
      setReadingList((current) => current.some((item) => String(getBookId(item)) === String(id))
        ? current
        : [...current, book])
    },
    removeBook(id) {
      setReadingList((current) => current.filter((book) => String(getBookId(book)) !== String(id)))
    },
    clearList() {
      setReadingList([])
    },
  }), [readingList])

  return <ReadingListContext.Provider value={value}>{children}</ReadingListContext.Provider>
}
