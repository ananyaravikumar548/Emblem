# Deploy EMBLEM

EMBLEM can run as one container: Express serves the production React build and the `/api/v1` API from the same origin. This keeps authenticated cookies same-origin and avoids a production localhost URL.

## Required environment

Set these values in your hosting provider's secret/environment settings:

- `MONGODB_URI`: a reachable MongoDB connection string. Create the database and restrict network access to the application host.
- `JWT_SECRET`: a unique random secret with at least 32 characters. Generate one with `openssl rand -base64 48`.
- `GROQ_API_KEY`: an active Groq API key for brand generation.
- `NODE_ENV=production`
- `PORT`: provided by most container hosts; the image defaults to `8080`.

Optional settings:

- `CORS_ORIGINS`: comma-separated allowed browser origins when the API is called from a separate frontend origin. Leave unset for the bundled same-origin app.
- `COOKIE_SAME_SITE`: defaults to `lax`. Set to `none` only when the frontend and API are on different sites; HTTPS and the exact `CORS_ORIGINS` value are then required.
- `GROQ_MODEL`: optionally pin a model that is active for the configured Groq key.
- `ALLOW_DEMO_LOGIN`: leave unset or `false` in production. The shared demo account is disabled by default in production.

Never commit `.env` files or put API keys in `REACT_APP_*` variables; frontend variables are embedded in public JavaScript bundles.

## Docker deployment

From the repository root:

```sh
docker build -t emblem .
docker run --name emblem --restart unless-stopped -p 8080:8080 \
  -e NODE_ENV=production \
  -e MONGODB_URI='your-mongodb-uri' \
  -e JWT_SECRET='your-random-secret-of-at-least-32-characters' \
  -e GROQ_API_KEY='your-groq-api-key' \
  emblem
```

Configure your host to route HTTPS traffic to container port `8080`. The process listens on `PORT` when the host supplies one. The backend waits for MongoDB before accepting traffic and exits on a failed production database connection.

## Health checks

- `GET /api/v1/health` reports that the process is running.
- `GET /api/v1/ready` returns `200` only while MongoDB is connected; use it as the container readiness check.

After deployment, create a normal account through the app. Do not enable shared demo login for a public deployment.

## Local production build

```sh
npm install
npm run build
NODE_ENV=production PORT=8080 MONGODB_URI='...' JWT_SECRET='...' GROQ_API_KEY='...' npm start
```

For separate frontend hosting, build with `REACT_APP_API_URL=https://your-api-host/api/v1` and set `CORS_ORIGINS` on the backend to the exact frontend origin. If those hosts are cross-site, also set `COOKIE_SAME_SITE=none` and serve both over HTTPS.
