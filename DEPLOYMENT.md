# Deployment

## Frontend hosting

Deploy this Vite application on Netlify or Vercel. The static build is created by `npm run build`, and the output directory is `dist`.

### Frontend environment variables

- `VITE_API_BASE_URL`: public HTTPS origin of the deployed backend, for example `https://library-catalog-api.example.com`.
- Do not use `http://localhost:3000` in a production build.

### SPA routing

Configure a rewrite/fallback rule for all routes to `/index.html`, because the app uses direct URLs such as `/books/:id` and `/admin/bookings`.

Example Netlify rule in `public/_redirects`:

```text
/* /index.html 200
```

## Backend hosting

Deploy the sibling `library-catalog-service` repository to Render, Railway, or another Node 20+ host. The service start command is `npm start` and the public URL must use HTTPS.

### Backend environment variables

- `MONGODB_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: long random secret used to sign authentication tokens.
- `PORT`: hosting provider port, if required by the provider.
- `FRONTEND_ORIGINS`: exact deployed frontend origin(s), comma-separated. Do not include `/` at the end.
- `LOAN_DAYS`: default `14`.
- `FINE_PER_DAY`: default `0.25`.

The backend CORS configuration must allow the deployed frontend origin and permit credentials.

## Deployment issue and resolution

During test setup, the local PowerShell session initially blocked npm script execution and later resolved npm commands inconsistently. Using the absolute `npm.cmd` executable (`C:\Program Files\nodejs\npm.cmd`) and running commands from the repository directory bypassed the PowerShell script-policy issue. This matters for CI/build hosts too: use the package manager executable and verify Node/npm are on `PATH` before building.

A second deployment risk was accidentally retaining `VITE_API_BASE_URL=http://localhost:3000`. The production environment must set the HTTPS backend URL explicitly, then rebuild/redeploy; changing an environment variable after an existing static build will not update already-generated Vite assets.

## Submission URLs

- Frontend live URL: **TODO — add the deployed frontend URL**
- Backend live URL: **TODO — add the deployed backend URL**
- Frontend repository: **TODO — add repository URL**
- Backend repository: **TODO — add repository URL**

Verify `GET /genres` on the live backend and a catalog search on the live frontend before submission.
