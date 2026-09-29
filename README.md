# LOC'D .ke

One-page site + CMS for Brighton Serem (luxury locs). Next.js 16 + Payload 3 + Postgres.

## Who can do what

| | Admin (stylist) | Superadmin (developer) |
|---|---|---|
| Upload / edit photos (Media) | ✅ | ✅ |
| Services, Portfolio, Booking requests | create / edit | + delete |
| Homepage text, About, Site Settings | edit | edit |
| Delete media | ❌ | ✅ |
| Users & roles | own profile only | full |

Roles live in `src/access/roles.ts`. Only a superadmin can change a `role` field, so an admin cannot promote themselves.
Every content save calls `revalidatePath('/')` (`src/hooks/revalidateHome.ts`) so edits appear on the site immediately.

## Where things live

- `src/collections/`: Services, Bookings, PortfolioCategories, Media, Users
- `src/globals/`: Homepage (section text), ArtistProfile, SiteSettings
- `src/site/`: the one-page frontend (`site.css` holds all colours/fonts as tokens)
- `src/app/(frontend)/page.tsx`: the homepage
- The frontend is intentionally a single CMS-managed homepage; bookings use a dedicated public form.

## Setup

```bash
cp .env.example .env      # fill DATABASE_URL (Postgres), PAYLOAD_SECRET, NEXT_PUBLIC_SERVER_URL
npm ci
npm run dev               # http://localhost:3000, admin at /admin
```

The **first account created at /admin becomes the superadmin** (set its role to `superadmin`); create the stylist's account afterwards with role `admin`.

## Production checklist

1. **Postgres**: Neon or Supabase. Set `DATABASE_URL`.
2. **File storage (required)**: Netlify/Vercel disks are wiped each deploy. Create an S3-compatible bucket (Cloudflare R2 recommended) and set the `S3_*` vars in `.env.example`.
3. **Migrations**: run `npm run payload migrate:create` once locally, commit `src/migrations`, and run `npm run payload migrate` on deploy (dev mode auto-pushes schema; production should not).
4. Set `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `PREVIEW_SECRET`, `CRON_SECRET`.
5. Configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for public booking rate limits (5 submissions per IP per 15 minutes).
