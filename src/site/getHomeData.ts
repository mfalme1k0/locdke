import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

/** One cached fetch for everything on the page. Busted by `revalidateHome` hooks (tag: "home"). */
export const getHomeData = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })

    const [homepage, artist, settings, services, portfolio] = await Promise.all([
      payload.findGlobal({ slug: 'homepage', depth: 1 }),
      payload.findGlobal({ slug: 'artist-profile', depth: 1 }),
      payload.findGlobal({ slug: 'site-settings' }),
      payload.find({
        collection: 'services',
        where: { active: { equals: true } },
        sort: ['sortOrder', 'createdAt'],
        limit: 50,
        pagination: false,
      }),
      payload.find({
        collection: 'portfolio-categories',
        where: { active: { equals: true } },
        sort: ['sortOrder', '-createdAt'],
        depth: 1,
        limit: 50,
        pagination: false,
      }),
    ])

    return { homepage, artist, settings, services: services.docs, portfolio: portfolio.docs }
  },
  ['home-data'],
  { tags: ['home'] },
)
