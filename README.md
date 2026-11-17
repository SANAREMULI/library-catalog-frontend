# Open Shelf — Library Catalog

A responsive React catalog experience for browsing, filtering, searching, and viewing book details. Catalog filters are sent to the API (rather than filtering only the current page in the browser), so genre and search can be combined consistently with pagination.

## Requirements

- Node.js 20.19+ or 22.12+
- The Library Catalog API from the previous assignment, with `GET /books`, `GET /books/:id`, and `GET /genres`

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your API origin/base path (for example, `http://localhost:3000` or `http://localhost:3000/api`).
3. Start the frontend with `npm run dev` and open the local URL printed by Vite.
4. Create a production build with `npm run build`; preview it with `npm run preview`.

The API must allow browser requests from the frontend origin (CORS). The app requests `GET {VITE_API_BASE_URL}/books?genre=...&search=...&page=...`, `GET {VITE_API_BASE_URL}/books/:id`, and `GET {VITE_API_BASE_URL}/genres`. Empty genre/search values are omitted; page is always included.

## Expected API data

The list endpoints may return a JSON array, or an object containing a `books`, `genres`, `items`, `results`, or `data` array. The books endpoint may also include `totalPages` or `pagination.totalPages`. A book should include an `id` (or `_id`/`bookId`), `title`, `author`, and `genre`; optional fields include `description`/`summary`, `coverImage`/`coverUrl`/`imageUrl`/`cover`, `isbn`, `publishedYear`, `publisher`, and `pages`. A genre can be a string or an object with a `name` or `genre` property. Adjust `src/lib/api.js` if the prior assignment uses a different response envelope.

Search waits 350 ms after typing before updating the query. The query string preserves active filters when another filter changes, and filter changes reset pagination to page 1. Loading, fetch errors, and successful zero-result responses are presented distinctly; invalid detail links show a recovery path back to the catalog.

## Demo recording

**Add your own short screen recording or GIF here before submission.** Demonstrate browsing the catalog, selecting a genre, searching while the genre remains selected, and opening a book detail page. Replace this note with the committed GIF path or a shareable recording link when ready.

## Deployment

Deploy the Vite static build to a static host such as GitHub Pages, Netlify, or Vercel. Configure `VITE_API_BASE_URL` in the host's build environment and enable SPA fallback/rewrite behavior so direct visits to `/books/:id` resolve to `index.html`. The API must be reachable over HTTPS and permit the deployed origin through CORS. This repository does not include or deploy the backend API.
