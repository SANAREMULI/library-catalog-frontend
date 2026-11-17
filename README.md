# Open Shelf — Library Catalog

A responsive React catalog experience for browsing, filtering, searching, and viewing book details, with a persistent reading list, API-backed account flow, protected space booking, and librarian admin pages. Catalog filters are sent to the API (rather than filtering only the current page in the browser), so genre and search can be combined consistently with pagination.

## Requirements

- Node.js 20.19+ or 22.12+
- The companion `library-catalog-service` API, with `GET /books`, `GET /books/:id`, and `GET /genres`
- Auth API routes at `/api/auth/login`, `/api/auth/register`, and `/api/users/profile`
- Week 6 API routes at `/api/borrow-requests`, `/api/bookings`, and librarian CRUD routes under `/api/books`

## Setup

1. Follow `library-catalog-service/README.md` to install dependencies, configure MongoDB and the secret, and start the backend on port `3000`.
2. If you need the sample catalog and librarian account, run the backend seed command once. **It clears existing books and genres before reseeding**, so don't run it if you want to keep current catalog data.
3. Install frontend dependencies with `npm install`.
4. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL=http://localhost:3000`.
5. Start the frontend with `npm run dev` and open the local URL printed by Vite.
6. Create a production build with `npm run build`; preview it with `npm run preview`.

For the demo flow, register/sign in as a patron to request a book and make a space booking. Sign in as the seeded librarian to use `/admin/books`, `/admin/borrow-requests`, and `/admin/bookings`.

The API must allow browser requests from the frontend origin (CORS). The app requests `GET {VITE_API_BASE_URL}/books?genre=...&search=...&page=...`, `GET {VITE_API_BASE_URL}/books/:id`, and `GET {VITE_API_BASE_URL}/genres`. Empty genre/search values are omitted; page is always included. It also calls `POST /api/auth/login` with `{ "email", "password" }`, `POST /api/auth/register` with `{ "name", "email", "password" }` (the backend accepts `name` as the username), and `GET /api/users/profile` at startup to restore a signed-in session. The service uses a credentialed, HTTP-only auth cookie. Week 6 calls include `POST /api/borrow-requests` with `{ "bookId" }`, `POST /api/bookings` with `{ "space", "date", "startTime", "endTime" }`, `GET /api/borrow-requests`, `PATCH /api/borrow-requests/:id` with `{ "status" }`, `GET /api/bookings`, and librarian book CRUD at `/api/books`. If `VITE_API_BASE_URL` ends in `/api`, the auth and Week 6 routes do not duplicate that path prefix.

## Expected API data

The list endpoints may return a JSON array, or an object containing a `books`, `genres`, `items`, `results`, or `data` array. The books endpoint may also include `totalPages` or `pagination.totalPages`. A book should include an `id` (or `_id`/`bookId`), `title`, `author`, and `genre`; optional fields include `description`/`summary`, `coverImage`/`coverUrl`/`imageUrl`/`cover`, `isbn`, `publishedYear`, `publisher`, and `pages`. A genre can be a string or an object with a `name` or `genre` property. Adjust `src/lib/api.js` if the prior assignment uses a different response envelope.

Search waits 350 ms after typing before updating the query. The query string preserves active filters when another filter changes, and filter changes reset pagination to page 1. Loading, fetch errors, and successful zero-result responses are presented distinctly; invalid detail links show a recovery path back to the catalog.

## Reading list and account behavior

The reading list is stored in browser `localStorage` under `open-shelf-reading-list`. This keeps the list available after refresh without requiring a reading-list API endpoint and works for this client-side assignment; it is device/browser-specific and is not shared across devices or accounts. Books can be added or removed from catalog cards and detail pages, and the Reading list page can remove individual items or clear the list.

The auth context checks `GET /api/users/profile` on app startup. Login/register API errors (including invalid credentials and duplicate emails) are shown in the form. The companion service uses a credentialed HTTP-only auth cookie; the frontend also supports bearer tokens if a different API returns one. Patron booking is protected by auth status. Librarian pages additionally require the profile role to be `librarian` and read/write current server state rather than only changing the screen.

## Week 6 server rules

- **Late fines:** calculate on the server at `$0.25 per calendar day late`: `max(0, calendar days from dueAt to returnedAt) × $0.25`, rounded to cents. A client must never submit the fine; the `PATCH` status route computes it when status changes to `returned`.
- **Booking overlaps:** for an existing booking in the same space on the same date, reject when `newStart < existingEnd && newEnd > existingStart`. This catches partial overlaps while allowing adjacent appointments (one ending exactly when another begins). The check must run on the server before saving.
- **Borrow availability:** the server rejects a request when `availableCopies` is zero and gets the patron identity from the authenticated session/token, not the request body.

The frontend calls these routes and shows server errors (including unavailable books or overlapping bookings). The companion backend project is in the sibling `library-catalog-service` repository; use its README for database setup and startup. Its existing seed script clears books and genres before loading sample catalog data, so only run `npm run seed` if resetting that data is intended.

## Demo recording

**Add your own short screen recording or GIF here before submission.** Demonstrate creating a borrow request from the reading list, changing it to returned as a librarian and seeing the server-calculated fine, then attempting an overlapping booking and seeing the server reject it. Replace this note with a committed recording/GIF path or a shareable recording link when ready.

## Deployment

Deploy the Vite static build to a static host such as GitHub Pages, Netlify, or Vercel. Configure `VITE_API_BASE_URL` in the host's build environment and enable SPA fallback/rewrite behavior so direct visits to `/books/:id` resolve to `index.html`. The API must be reachable over HTTPS and permit the deployed origin through CORS. This repository does not include or deploy the backend API.
