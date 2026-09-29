# LOC'D .ke

LOC'D .ke is a CMS-managed, single-page website for Brighton Serem's luxury loc services. The frontend is built with Next.js 16 and React 19; Payload CMS 3 manages content and authentication, and Postgres stores CMS records.

## Product structure

The public site is one page, organized into a hero, services, artist profile, portfolio, and booking sections. Content is loaded from Payload globals and collections rather than being hard-coded into the page.

| CMS area         | What it controls                                                          |
| ---------------- | ------------------------------------------------------------------------- |
| Homepage Text    | Hero copy, service introduction, portfolio introduction, and booking copy |
| About the Artist | Artist name, biography, portrait, and highlights                          |
| Site Settings    | Brand, contact details, social links, and homepage statistics             |
| Services         | Service descriptions, prices, display order, and active state             |
| Portfolio        | Portfolio cards, cover photos, captions, active state, and display order  |
| Media            | Uploaded photos and their alt text, captions, and credits                 |
| Booking Requests | Public appointment inquiries and their internal status/notes              |

The visual system and responsive layouts live in `src/site/site.css`. `src/site/reveal.tsx` provides one-time scroll reveals using `IntersectionObserver`; content remains visible when reduced motion is requested or the observer is unavailable. The mobile navigation is implemented in `src/site/SiteNav.tsx`.

## Roles and access

| Capability                                            | Admin (stylist) | Superadmin (developer)   |
| ----------------------------------------------------- | --------------- | ------------------------ |
| View and edit own user profile                        | Yes             | Yes                      |
| Manage services, portfolio, and booking requests      | Create and edit | Create, edit, and delete |
| Edit homepage text, artist profile, and site settings | Yes             | Yes                      |
| Upload and edit media                                 | Yes             | Yes                      |
| Delete media                                          | No              | Yes                      |
| Create/delete users and change roles                  | No              | Yes                      |

Collection and field access rules are in `src/access/roles.ts` and the relevant collection configs. Public visitors can create booking requests, but cannot read or edit them. A visitor cannot set a request's status or internal notes. Normal account creation and role changes require a superadmin; do not rely on public signup to provision privileged users.

To bootstrap the first superadmin, use the Payload Local API from a trusted machine with the intended database configured. The following creates one account while explicitly bypassing collection access for this one-time operation. The password is prompted without echo and is not placed in shell history:

```bash
read -r -p 'Superadmin name: ' BOOTSTRAP_NAME
read -r -p 'Superadmin email: ' BOOTSTRAP_EMAIL
read -r -s -p 'Superadmin password: ' BOOTSTRAP_PASSWORD
printf '\n'
export BOOTSTRAP_NAME BOOTSTRAP_EMAIL BOOTSTRAP_PASSWORD

node --import tsx/esm --input-type=module <<'NODE'
import 'dotenv/config'
import { getPayload } from 'payload'
import config from './src/payload.config.ts'

const payload = await getPayload({ config })
try {
	await payload.create({
		collection: 'users',
		overrideAccess: true,
		data: {
			name: process.env.BOOTSTRAP_NAME,
			email: process.env.BOOTSTRAP_EMAIL,
			password: process.env.BOOTSTRAP_PASSWORD,
			role: 'superadmin',
		},
	})
} finally {
	await payload.destroy()
}
NODE

unset BOOTSTRAP_NAME BOOTSTRAP_EMAIL BOOTSTRAP_PASSWORD
```

Sign in at `/admin` as the superadmin, then create the stylist account with role `admin`. Never run the bootstrap with a publicly accessible or production database unless that is the intended account.

## Requirements

- Node.js `20.9.0` or newer
- npm (the repository uses `package-lock.json`)
- Postgres; Docker Compose provides Postgres 16 for local development
- An S3-compatible bucket for production media storage
- Upstash Redis REST credentials for production booking rate limits

## Local development

1. Copy the example environment file and set a strong local Payload secret:

   ```bash
   cp .env.example .env
   ```

2. Start the app and Postgres with Docker Compose:

   ```bash
   docker compose up
   ```

   The app is at `http://localhost:3000`; the Payload admin is at `http://localhost:3000/admin`. Compose points the app container at the `postgres` service and initializes a local `locdke` database.

   To run Next.js on the host instead, start only the database with `docker compose up -d postgres`, install dependencies with `npm ci`, and run `npm run dev`. The example `DATABASE_URL` uses `127.0.0.1`, which is appropriate for the host process.

3. Bootstrap the first superadmin using the command above, then sign in and create the stylist account.

In development, Payload may push schema changes directly to the configured database. Use a disposable database for experiments and take backups before changing schemas. Do not point local tests at production data.

## Environment variables

| Variable                   | Required                                  | Purpose                                                                                   |
| -------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| `DATABASE_URL`             | Yes                                       | Postgres connection string                                                                |
| `PAYLOAD_SECRET`           | Yes                                       | Signs/encrypts Payload authentication tokens; keep stable and private                     |
| `NEXT_PUBLIC_SERVER_URL`   | Yes in deployment                         | Canonical site origin used for URLs, metadata, and image configuration; no trailing slash |
| `PREVIEW_SECRET`           | If preview routes are used                | Secret for validating preview requests                                                    |
| `CRON_SECRET`              | If unauthenticated cron requests are used | Authorizes Payload job requests with `Authorization: Bearer <secret>`                     |
| `UPSTASH_REDIS_REST_URL`   | Production                                | Upstash Redis REST endpoint used by booking rate limiting                                 |
| `UPSTASH_REDIS_REST_TOKEN` | Production                                | Private Upstash Redis REST token; never expose to the browser                             |
| `S3_BUCKET`                | Production                                | Enables S3-compatible storage and is required by the production startup guard             |
| `S3_ENDPOINT`              | S3-compatible providers                   | Provider endpoint, such as an R2 endpoint                                                 |
| `S3_REGION`                | Optional                                  | Region; defaults to `auto` for R2-compatible storage                                      |
| `S3_ACCESS_KEY_ID`         | Production                                | Private object-storage access key                                                         |
| `S3_SECRET_ACCESS_KEY`     | Production                                | Private object-storage secret                                                             |

Leave S3 settings empty for local development; Payload stores local uploads on disk. Production startup fails if the bucket or either S3 credential is missing. Configure all storage values in the deployment environment, not in source control.

## Booking submissions

The booking form sends a public `POST` to Payload's `/api/bookings` REST endpoint. It accepts the visitor's name and email plus optional phone, service, preferred date, and message. A hidden honeypot rejects basic bot submissions. Production requests are limited to five per client IP per rolling 15-minute window using an atomic Redis script; IP addresses are HMAC-hashed with `PAYLOAD_SECRET` before they are stored in Redis. If Redis is missing or unavailable in production, submissions fail closed with a service-unavailable response. Local development does not require Redis.

Configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` before enabling the public booking form in production. Booking records are stored in the CMS; this project does not send confirmation email automatically.

## Commands

| Command                           | Purpose                                                       |
| --------------------------------- | ------------------------------------------------------------- |
| `npm run dev`                     | Start the Next.js development server                          |
| `npm run build`                   | Create the production build and then generate the sitemap     |
| `node .next/standalone/server.js` | Run the production standalone server after a successful build |
| `npm run lint`                    | Run ESLint across the repository                              |
| `npm run test:int`                | Run Vitest integration tests                                  |
| `npm run test:e2e`                | Run Playwright browser tests                                  |
| `npm run test`                    | Run integration tests followed by browser tests               |
| `npm run generate:types`          | Regenerate `src/payload-types.ts` from the Payload config     |
| `npm run generate:importmap`      | Regenerate Payload's admin import map                         |
| `npm run payload migrate:create`  | Create a database migration from schema changes               |
| `npm run payload migrate`         | Apply committed migrations                                    |

Install the Playwright Chromium browser once per environment with `npx playwright install chromium`. The integration and e2e suites use `DATABASE_URL`; the e2e helpers create and delete a fixed test user. Run them only against a disposable test database. The production image uses Next.js standalone output; `Dockerfile` is the reference for building and running that image.

## Production deployment

1. Provision Postgres (for example, Neon or Supabase) and set `DATABASE_URL`.
2. Configure `PAYLOAD_SECRET` and `NEXT_PUBLIC_SERVER_URL`; add `PREVIEW_SECRET` and `CRON_SECRET` when those integrations are enabled.
3. Create an S3-compatible bucket and set `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, plus provider-specific endpoint/region values. The production server refuses to start without the bucket and credentials because local disks on serverless hosts are ephemeral.
4. Create an Upstash Redis database and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` so public booking submissions can be rate-limited.
5. Provision the superadmin through a trusted Local API environment, then create the stylist's admin account in Payload.
6. Generate migrations during development, commit the migration files in `src/migrations`, and apply them during deployment with `npm run payload migrate`. Do not rely on development schema push in production.
7. Build with `npm run build`, then run the standalone server or build the included Docker image. The Docker runner expects `.next/standalone/server.js` and `.next/static`.

The build generates `public/sitemap.xml` and a sitemap index based on `NEXT_PUBLIC_SERVER_URL`. Review those generated files when changing sitemap configuration.

## Project map

- `src/app/(frontend)/page.tsx`: single-page public site
- `src/site/`: site components, visual tokens, responsive styles, and reveal motion
- `src/collections/`: bookings, media, portfolio, services, and users
- `src/globals/`: homepage, artist profile, and site settings
- `src/access/roles.ts`: shared role and access helpers
- `src/hooks/revalidateHome.ts`: invalidates the cached homepage after content changes
- `src/plugins/index.ts`: optional S3 storage plugin and production storage validation
- `tests/int/`: integration tests, including booking rate-limit behavior
- `tests/e2e/`: browser checks for the homepage and Payload admin
