# Frontend Docker Spec

## Scope

Add Docker support for the Next.js frontend only.

Target files:

- `Dockerfile`
- `.dockerignore`
- optional `docker-compose.yml`
- `next.config.ts`
- `src/app/api/[...path]/route.ts`
- `.env.example`
- `package.json`
- `README.md`

Do not modify unrelated app logic, feature flows, backend configuration, database services, Redis, Nginx, or deployment platform configuration.

## Runtime API Proxy

Add a runtime proxy route at:

```txt
src/app/api/[...path]/route.ts
```

The proxy route must:

- Read `BACKEND_API_URL` at runtime.
- Forward `/api/*` requests to `${BACKEND_API_URL}/*`.
- Preserve the request method.
- Forward `cookie`, `content-type`, and `accept` headers when present.
- Preserve the request body for methods that support a body.
- Do not forward hop-by-hop or unsafe headers such as `host`, `connection`, and `content-length`.
- Return the backend response status, headers, and body.
- Fail clearly when `BACKEND_API_URL` is missing.

`BACKEND_API_URL` must be configurable per environment. Runtime changes to `BACKEND_API_URL` must not require rebuilding the Docker image.

Client code must keep using:

```env
NEXT_PUBLIC_API_URL=/api
```

Do not hardcode a backend origin in client code.

## Next.js Configuration

Update `next.config.ts` to use:

```ts
output: "standalone"
```

Remove the existing `rewrites()` configuration from `next.config.ts`.

Remove the top-level `BACKEND_API_URL` read from `next.config.ts`.

`next.config.ts` must not proxy API requests anymore. It should only keep Next.js configuration needed for Docker, including `output: "standalone"`.

Runtime backend selection and API proxying must be handled by the App Router proxy route.

## Dockerfile

Add a Dockerfile that:

- Uses npm.
- Uses `npm ci`.
- Builds the app with `npm run build`.
- Uses Next.js standalone output.
- Runs the built app with Node.
- Exposes port `3001`.
- Starts the app on port `3001`.
- Does not bake a fixed backend URL into the image.

The image must support runtime `BACKEND_API_URL` values such as:

```env
BACKEND_API_URL=http://host.docker.internal:3000

# Backend in the same Docker network
# BACKEND_API_URL=http://backend:3000

# Deployed backend
# BACKEND_API_URL=https://api.example.com

NEXT_PUBLIC_API_URL=/api
```

## `.dockerignore`

Add a `.dockerignore` that excludes local and generated files not needed in the Docker build context, including:

```txt
node_modules
.next
.env
.env.local
.git
coverage
```

Do not ignore files required for the frontend build.

## Optional `docker-compose.yml`

A local-only `docker-compose.yml` may be added if useful.

If added, it must:

- Define only the frontend service.
- Build from the current frontend repository.
- Map host port `3001` to container port `3001`.
- Set `NEXT_PUBLIC_API_URL=/api`.
- Set a local example `BACKEND_API_URL=http://host.docker.internal:3000`.

It must not add backend, database, Redis, Nginx, or deployment services.

## Environment Variables

Update `.env.example` to keep:

```env
NEXT_PUBLIC_API_URL=/api
```

Document that `BACKEND_API_URL` depends on where the backend runs:

```env
BACKEND_API_URL=http://host.docker.internal:3000

# Backend in the same Docker network
# BACKEND_API_URL=http://backend:3000

# Deployed backend
# BACKEND_API_URL=https://api.example.com

NEXT_PUBLIC_API_URL=/api
```

For non-Docker local development, `BACKEND_API_URL=http://localhost:3000` remains valid when the frontend runs directly on the host.

Inside Docker documentation, do not hardcode `localhost:3000` as the backend URL because `localhost` inside the frontend container points to the frontend container itself.

## README Updates

Update `README.md` with a Docker section that separates:

- Essential local Docker flow.
- Docker command reference.

The README must explain:

- What each Docker command does.
- Required environment variables.
- Why `NEXT_PUBLIC_API_URL` remains `/api`.
- Why Docker uses `host.docker.internal` for a backend running on the host.
- That the backend must already be running separately.
- How to use `docker-compose.yml` if it is added.

## npm Docker Scripts

Add npm scripts in `package.json` to wrap the common Docker commands.

The scripts must:

- Use Docker commands directly.
- Use Compose as the only local container run path.
- Keep `BACKEND_API_URL=http://host.docker.internal:3000` only as the local host-backend default in `docker-compose.yml`.
- Keep `NEXT_PUBLIC_API_URL=/api`.
- Include scripts for image build, local Compose up, and local Compose down.
- Avoid redundant direct `docker run` scripts while Compose is the documented local workflow.

## Verification

Run:

```bash
npm run build
```

Validate the Docker build:

```bash
npm run docker:build
```

Run the frontend container with Compose:

```bash
npm run docker:up
```

Stop the frontend container with Compose:

```bash
npm run docker:down
```

Manual verification:

- Open `http://localhost:3001`.
- Confirm the frontend loads.
- Confirm frontend API calls use `/api`.
- Confirm `/api/*` requests are proxied to `BACKEND_API_URL`.
